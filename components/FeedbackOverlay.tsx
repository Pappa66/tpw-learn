// components/FeedbackOverlay.tsx

import React from 'react';

interface FeedbackOverlayProps {
  isVisible: boolean;
  score: number;
  status: string;
  userText: string;
  onClose: () => void;
}

export default function FeedbackOverlay({ isVisible, score, status, userText, onClose }: FeedbackOverlayProps) {
  if (!isVisible) return null;

  const isReady = status === 'READY';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-500 ${isReady ? 'bg-green-600' : 'bg-red-600'}`}>
      {/* Ikon Status */}
      <div className="text-8xl mb-4">
        {isReady ? '✅' : '⚠️'}
      </div>

      {/* Skor Besar */}
      <h2 className="text-9xl font-black text-white mb-2 drop-shadow-lg">
        {score}
      </h2>
      
      <p className="text-2xl font-bold tracking-[0.2em] text-white uppercase mb-8">
        Status: {status}
      </p>

      {/* Box Detail Teks */}
      <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl w-full max-w-sm text-center mb-12">
        <p className="text-xs text-white/60 uppercase font-bold mb-2 tracking-widest">Suara Terdeteksi</p>
        <p className="text-xl font-medium text-white">"{userText}"</p>
      </div>

      {/* Tombol Lanjut */}
      <button 
        onClick={onClose}
        className="px-12 py-4 bg-white text-black font-black rounded-full shadow-2xl active:scale-95 transition-transform uppercase tracking-widest"
      >
        Lanjutkan Latihan
      </button>
    </div>
  );
}