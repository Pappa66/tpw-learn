// app/report/page.tsx
'use client';

import { Evaluator } from '@/lib/Evaluator';

export default function ReportPage() {
  // Mock data untuk simulasi laporan (Besok kita sambungkan ke vLLM/DB)
  const stats = {
    totalSessions: 42,
    avgScore: 88,
    currentLevel: 12,
    userName: "Daniel Tan",
    history: [
      { id: 1, date: "2026-05-04", level: 12, score: 95, status: "READY" },
      { id: 2, date: "2026-05-03", level: 11, score: 82, status: "READY" },
      { id: 3, date: "2026-05-02", level: 11, score: 55, status: "DEVELOPING" },
    ]
  };

  const progressPercent = Evaluator.getProgressPercentage(stats.currentLevel);

  return (
    <div className="max-w-md mx-auto p-6 pt-10 pb-20">
      <header className="mb-10 text-center">
        <h1 className="text-xs font-black text-leeloo uppercase tracking-[0.4em] mb-2">Performance Report</h1>
        <p className="text-3xl font-black tracking-tighter">{stats.userName}</p>
      </header>

      {/* Main Stats Card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Status Kesiapan</p>
            <p className="text-3xl font-black text-shanti">READY</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Avg Score</p>
            <p className="text-3xl font-black text-white">{stats.avgScore}</p>
          </div>
        </div>

        {/* Progress Level (Blueprint 0-30) */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Level Progress</p>
            <p className="text-xs font-mono font-bold">{stats.currentLevel} / 30</p>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-leeloo transition-all duration-1000 shadow-[0_0_15px_rgba(220,26,26,0.5)]" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* History List */}
      <section>
        <h2 className="text-xs font-black mb-4 uppercase tracking-widest text-gray-500">Session History</h2>
        <div className="space-y-3">
          {stats.history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
              <div>
                <p className="text-sm font-bold text-white">{item.date}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Level {item.level} - Survival Module</p>
              </div>
              <div className="text-right">
                <p className="font-black text-xl">{item.score}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${item.score >= 80 ? 'text-shanti' : 'text-yellow-500'}`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}