
import React, { useState, useEffect } from 'react';
import { ReceiptItem, ReceiptType } from '../types';

interface ReceiptFormProps {
  onSave: (item: any) => void;
  initialData?: ReceiptItem;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<any>({
    type: ReceiptType.REPAIR,
    date: new Date().toISOString().slice(0, 10),
    customer: '',
    issue: '',
    qty: 1,
    etc: '',
    devPeriod: '',
    devCost: '',
    devDue: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer || !formData.issue) {
      alert('고객사와 요청 내용을 입력해주세요.');
      return;
    }
    onSave(formData);
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>구분</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            className={inputClass}
          >
            <option value={ReceiptType.REPAIR}>수리 (Repair)</option>
            <option value={ReceiptType.DEV}>개발 (Dev)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>접수일</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>고객사 / 국가</label>
          <input 
            name="customer" 
            placeholder="예: 삼성전자, USA"
            value={formData.customer} 
            onChange={handleChange} 
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>요청 / 증상 (S/N)</label>
          <input 
            name="issue" 
            placeholder="상세 증상 또는 제품 시리얼 번호"
            value={formData.issue} 
            onChange={handleChange} 
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>수량</label>
            <input 
              type="number" 
              name="qty" 
              value={formData.qty} 
              onChange={handleChange} 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>기타</label>
            <input 
              name="etc" 
              placeholder="참조사항"
              value={formData.etc} 
              onChange={handleChange} 
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {formData.type === ReceiptType.DEV && (
        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className={labelClass}>개발 기간</label>
            <input 
              name="devPeriod" 
              placeholder="예: 3개월"
              value={formData.devPeriod} 
              onChange={handleChange} 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>개발비</label>
            <input 
              name="devCost" 
              placeholder="예: 5,000,000원"
              value={formData.devCost} 
              onChange={handleChange} 
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>예상 완료일</label>
            <input 
              type="date" 
              name="devDue" 
              value={formData.devDue} 
              onChange={handleChange} 
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          {initialData ? '수정사항 저장하기' : '신규 접수 완료'}
        </button>
      </div>
    </form>
  );
};

export default ReceiptForm;
