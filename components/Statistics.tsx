
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { SummaryData, ReceiptItem } from '../types';
import { GoogleGenAI } from '@google/genai';

interface StatisticsProps {
  summary: SummaryData;
  data: ReceiptItem[];
}

const Statistics: React.FC<StatisticsProps> = ({ summary, data }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Added type casting for vals to resolve property access errors on unknown type (lines 18, 19)
  const monthlyData = Object.entries(summary.monthly).map(([month, vals]) => {
    const v = vals as { repair: number; dev: number };
    return {
      name: month,
      repair: v.repair,
      dev: v.dev
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const statusData = Object.entries(summary.status).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#6366f1'];

  const generateAIInsight = async () => {
    if (data.length === 0) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `다음은 업무 접수 대장 데이터 요약입니다. 이를 바탕으로 현재 비즈니스 현황을 분석하고, 앞으로의 추천 전략 3가지를 한국어로 짧고 명확하게 작성해주세요:
      데이터 개수: ${data.length}건
      월별 데이터: ${JSON.stringify(monthlyData)}
      상태별 데이터: ${JSON.stringify(statusData)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setInsight(response.text || '인사이트를 생성할 수 없습니다.');
    } catch (error) {
      console.error(error);
      setInsight('AI 통계 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            월별 처리량 추이
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="repair" name="수리" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="dev" name="개발" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            상태별 누적 분포
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI 비즈니스 스마트 분석
          </h3>
          
          {insight ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-in fade-in duration-500">
              <p className="whitespace-pre-wrap leading-relaxed text-indigo-50 italic">
                {insight}
              </p>
              <button 
                onClick={() => setInsight('')}
                className="mt-4 text-sm font-semibold text-indigo-200 hover:text-white transition-colors"
              >
                다시 분석하기
              </button>
            </div>
          ) : (
            <div>
              <p className="text-indigo-100 mb-6 max-w-2xl">Gemini AI가 귀하의 접수 데이터를 분석하여 현재 성과를 측정하고 미래 전략을 제안합니다.</p>
              <button 
                onClick={generateAIInsight}
                disabled={loading || data.length === 0}
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    분석 중...
                  </>
                ) : '지금 인사이트 생성하기'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
