// components/SessionSummary.tsx

import React from 'react';
import { Evaluator } from '@/lib/Evaluator';

interface SummaryProps {
  isVisible: boolean;
  averageScore: number;
  totalSteps: number;
  onRestart: () => void;
}

export default function SessionSummary({ isVisible, averageScore, totalSteps, onRestart }: SummaryProps) {
  if (!isVisible) return null;

  const status = Evaluator.getAssessment(averageScore, 'Shanti'); // Ambil status umum
  const progress = (averageScore / 100) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <h2 className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold mb-10">Hasil Evaluasi Sesi</h2>
      
      {/* Circular Progress (Mockup 8) */}
      <div className="relative w-64 h-64 mb-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-900" />
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" 
            strokeDasharray={753.6} strokeDashoffset={753.6 - (753.6 * averageScore) / 100}
            className={`${status.status === 'READY' ? 'text-green-500' : 'text-red-500'} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl font-black">{averageScore}</span>
          <span className="text-xs font-bold opacity-50 uppercase">Rata-rata Skor</span>
        </div>
      </div>

      <div className="text-center mb-12">
        <p className={`text-2xl font-black mb-2 ${status.color}`}>KESIAPAN: {status.status}</p>
        <p className="text-gray-400 text-sm max-w-xs">Berdasarkan {totalSteps} latihan, tingkat komunikasi survival Tuan berada di level fungsional.</p>
      </div>

      <button onClick={onRestart} className="w-full max-w-xs py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all">
        ULANGI SESI
      </button>
    </div>
  );
}