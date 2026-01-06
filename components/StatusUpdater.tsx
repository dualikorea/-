
import React, { useState } from 'react';
import { ReceiptItem, ReceiptStatus } from '../types';

interface StatusUpdaterProps {
  data: ReceiptItem[];
  onUpdateStatus: (id: string, status: ReceiptStatus) => void;
}

const StatusUpdater: React.FC<StatusUpdaterProps> = ({ data, onUpdateStatus }) => {
  const [selectedId, setSelectedId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(ReceiptStatus.REPAIR_COMPLETED);

  const handleUpdate = () => {
    if (!selectedId) return;
    onUpdateStatus(selectedId, selectedStatus);
    setSelectedId('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <select 
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="px-3 py-2 text-sm bg-transparent border-none focus:ring-0 outline-none max-w-[200px]"
      >
        <option value="">항목 선택</option>
        {data.map((d, i) => (
          <option key={d.id} value={d.id}>{`${i+1}. [${d.customer}] ${d.issue.slice(0, 15)}...`}</option>
        ))}
      </select>
      
      <div className="h-4 w-px bg-slate-200 hidden sm:block" />

      <select 
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as ReceiptStatus)}
        className="px-3 py-2 text-sm bg-transparent border-none focus:ring-0 outline-none"
      >
        <option value={ReceiptStatus.REPAIR_COMPLETED}>수리완료</option>
        <option value={ReceiptStatus.REPAIR_FAILED}>수리불가</option>
        <option value={ReceiptStatus.EXCHANGE}>교환</option>
        <option value={ReceiptStatus.DEV_COMPLETED}>개발완료</option>
      </select>

      <button 
        onClick={handleUpdate}
        disabled={!selectedId}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
      >
        상태 변경
      </button>
    </div>
  );
};

export default StatusUpdater;
