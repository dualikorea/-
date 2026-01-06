
import React, { useState, useEffect, useMemo } from 'react';
import { ReceiptItem, ReceiptType, ReceiptStatus, SummaryData } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptList from './components/ReceiptList';
import Statistics from './components/Statistics';
import StatusUpdater from './components/StatusUpdater';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [data, setData] = useState<ReceiptItem[]>([]);
  const [editingItem, setEditingItem] = useState<ReceiptItem | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'stats' | 'form'>('list');
  const [filterType, setFilterType] = useState<string>('');

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem('receipts_v2');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('receipts_v2', JSON.stringify(data));
  }, [data]);

  const handleSave = (item: Omit<ReceiptItem, 'id' | 'createdAt' | 'status' | 'doneDate'>) => {
    if (editingItem) {
      setData(prev => prev.map(d => d.id === editingItem.id ? { ...editingItem, ...item } : d));
      setEditingItem(null);
    } else {
      const newItem: ReceiptItem = {
        ...item,
        id: crypto.randomUUID(),
        status: ReceiptStatus.RECEIVED,
        doneDate: '',
        createdAt: Date.now(),
      };
      setData(prev => [newItem, ...prev]);
    }
    setActiveTab('list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: ReceiptItem) => {
    setEditingItem(item);
    setActiveTab('form');
  };

  const handleUpdateStatus = (id: string, status: ReceiptStatus) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const isDone = status.includes('완료');
        return {
          ...item,
          status,
          doneDate: isDone ? new Date().toISOString().slice(0, 10) : item.doneDate
        };
      }
      return item;
    }));
  };

  const summary = useMemo<SummaryData>(() => {
    const s: SummaryData = { monthly: {}, yearly: {}, status: {} };
    data.forEach(d => {
      if (!d.date) return;
      const ym = d.date.slice(0, 7);
      const yy = d.date.slice(0, 4);
      
      if (!s.monthly[ym]) s.monthly[ym] = { repair: 0, dev: 0 };
      if (!s.yearly[yy]) s.yearly[yy] = { repair: 0, dev: 0 };
      
      const key = d.type === ReceiptType.REPAIR ? 'repair' : 'dev';
      s.monthly[ym][key] += d.qty;
      s.yearly[yy][key] += d.qty;
      
      s.status[d.status] = (s.status[d.status] || 0) + d.qty;
    });
    return s;
  }, [data]);

  const filteredData = useMemo(() => {
    return filterType ? data.filter(d => d.type === filterType) : data;
  }, [data, filterType]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 flex flex-col">
      {/* Sidebar / Desktop Nav */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex-col p-6 z-40">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ICONS.Repair className="w-5 h-5" />
          </div>
          접수대장 Pro
        </h1>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'list' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-800'}`}
          >
            <ICONS.Repair className="w-5 h-5 opacity-80" />
            현황 리스트
          </button>
          <button 
            onClick={() => setActiveTab('form')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'form' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            신규 등록
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'stats' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-800'}`}
          >
            <ICONS.Stats className="w-5 h-5 opacity-80" />
            데이터 통계
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
           <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">AD</div>
             <div>
               <p className="text-sm font-medium">관리자</p>
               <p className="text-xs text-slate-400">시스템 모드</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 grid grid-cols-3 z-50 px-2 py-3">
        <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center gap-1 ${activeTab === 'list' ? 'text-blue-600' : 'text-slate-500'}`}>
          <ICONS.Repair className="w-6 h-6" />
          <span className="text-[10px]">목록</span>
        </button>
        <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center gap-1 ${activeTab === 'form' ? 'text-blue-600' : 'text-slate-500'}`}>
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-[10px]">등록</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-blue-600' : 'text-slate-500'}`}>
          <ICONS.Stats className="w-6 h-6" />
          <span className="text-[10px]">통계</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">접수 현황 리스트</h2>
                <p className="text-slate-500">최근 등록된 순서대로 표시됩니다.</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">모든 구분</option>
                  <option value={ReceiptType.REPAIR}>수리</option>
                  <option value={ReceiptType.DEV}>개발</option>
                </select>
                <StatusUpdater 
                  data={data} 
                  onUpdateStatus={handleUpdateStatus} 
                />
              </div>
            </div>
            
            <ReceiptList 
              items={filteredData} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        )}

        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingItem ? '접수 수정' : '신규 접수 등록'}
              </h2>
              {editingItem && (
                <button 
                  onClick={() => {setEditingItem(null); setActiveTab('list');}}
                  className="text-slate-500 hover:text-slate-800 text-sm font-medium"
                >
                  취소하기
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <ReceiptForm 
                onSave={handleSave} 
                initialData={editingItem || undefined} 
              />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">비즈니스 통계</h2>
            <Statistics summary={summary} data={data} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
