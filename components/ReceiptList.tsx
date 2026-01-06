
import React from 'react';
import { ReceiptItem, ReceiptType } from '../types';
import { STATUS_COLORS } from '../constants';

interface ReceiptListProps {
  items: ReceiptItem[];
  onEdit: (item: ReceiptItem) => void;
  onDelete: (id: string) => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <p className="text-lg">등록된 데이터가 없습니다.</p>
        <p className="text-sm">신규 접수를 등록하여 업무를 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">구분</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">접수일</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">고객사</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">요청 / 증상</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">완료일</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === ReceiptType.REPAIR ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">
                  {item.customer}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={item.issue}>
                  {item.issue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">
                  {item.qty}개
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {item.doneDate || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="수정"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptList;
