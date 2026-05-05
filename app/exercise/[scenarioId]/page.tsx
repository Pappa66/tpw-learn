// app/exercise/[scenarioId]/page.tsx
'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- MOCK DATABASE UNTUK DEMO ---
const MOCK_EXERCISES = [
  {
    target: '快點！不要慢！',
    pinyin: 'Kuài diǎn! Búyào màn!',
    indonesian: 'Kerja cepat! Jangan lambat!',
    wrongText: '快點 不要慢 (Kuài diǎn búyào màn)',
    hint: 'Kurang tegas di kata "快點". Coba lebih cepat dan jelas.'
  },
  {
    target: '聽懂了嗎？',
    pinyin: 'Tīng dǒng le ma?',
    indonesian: 'Sudah mengerti belum?',
    wrongText: '聽懂了 (Tīng dǒng le)',
    hint: 'Nada tanya "ma?" tidak terdengar. Naikkan intonasi di akhir.'
  },
  {
    target: '不要再做錯了！',
    pinyin: 'Búyào zài zuò cuò le!',
    indonesian: 'Jangan buat salah lagi!',
    wrongText: '不要做錯 (Búyào zuò cuò)',
    hint: 'Kata "zài" (lagi) terlewat. Perhatikan detail instruksi.'
  }
];

export default function ExercisePage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const [mode, setMode] = useState<'Leeloo' | 'Shanti'>('Leeloo');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0); // Untuk mengatur skenario Benar/Salah di Demo

  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'salah' | 'benar'>('salah');

  const currentExercise = MOCK_EXERCISES[currentIndex] || MOCK_EXERCISES[0];
  const isLastQuestion = currentIndex === MOCK_EXERCISES.length - 1;

  // --- FITUR TTS (Text-to-Speech) BAWAAN BROWSER ---
  const speakText = (text: string, pinyin: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Hentikan suara sebelumnya

      const voices = window.speechSynthesis.getVoices();
      // Cari paket suara Mandarin
      const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));

      // Jika Linux/Browser tidak punya bahasa Mandarin, paksa dia membaca Pinyin (huruf latin)
      // agar tidak error menyebut "Chinese Letter".
      const textToSpeak = chineseVoice ? text : pinyin;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (chineseVoice) utterance.voice = chineseVoice;

      utterance.rate = mode === 'Leeloo' ? 1.2 : 0.85;
      utterance.pitch = mode === 'Leeloo' ? 1.3 : 1.0;

      // Tambahkan sedikit delay agar browser siap memainkan suara
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  // Otomatis bersuara ketika soal berganti (bisa diblokir autoplay browser, tapi aman)
  useEffect(() => {
    if (!showFeedback && !isRecording) {
      speakText(currentExercise.target, currentExercise.pinyin);
    }
  }, [currentIndex, mode, showFeedback, isRecording]);

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);

      // Simulasi proses STT & Penilaian AI
      setTimeout(() => {
        setIsRecording(false);

        // LOGIKA DEMO: Percobaan pertama selalu SALAH agar investor bisa lihat UI Koreksi.
        // Percobaan kedua selalu BENAR agar bisa lanjut.
        if (attempts === 0) {
          setFeedbackType('salah');
        } else {
          setFeedbackType('benar');
        }

        setShowFeedback(true);
      }, 2500); // Waktu loading pura-pura
    } else {
      setIsRecording(false);
    }
  };

  const handleUlangi = () => {
    setAttempts((prev) => prev + 1); // Tambah attempt supaya berikutnya sukses
    setShowFeedback(false);
  };

  const handleLanjut = () => {
    if (isLastQuestion) {
      router.push(`/exercise/${resolvedParams.scenarioId}/summary`);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAttempts(0); // Reset attempt untuk soal baru
      setShowFeedback(false);
    }
  };

  return (
    <main className={`min-h-[100vh] transition-colors duration-500 p-6 flex flex-col items-center ${mode === 'Leeloo' ? 'bg-[#0a0a0a]' : 'bg-green-950/20'}`}>
      {/* Header Bar */}
      <div className="w-full grid grid-cols-3 items-start mb-8">
        {/* Tombol Keluar (X) */}
        <div className="flex justify-start">
          <Link href="/belajar" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Keluar Latihan">
            ✕
          </Link>
        </div>
        
        {/* Toggle Mode AI */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setMode(mode === 'Leeloo' ? 'Shanti' : 'Leeloo')} title="Klik untuk ganti mode">
          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded w-fit ${mode === 'Leeloo' ? 'bg-leeloo/20 text-leeloo' : 'bg-shanti/20 text-shanti'}`}>
            {mode} Mode
          </span>
          <span className="text-xs text-gray-500 mt-1">{mode === 'Leeloo' ? 'Tekanan' : 'Dukungan'}</span>
        </div>

        {/* Indikator Soal */}
        <div className="flex justify-end text-gray-400 font-bold text-sm pt-1">
          {currentIndex + 1}/{MOCK_EXERCISES.length}
        </div>
      </div>

      {/* AI Avatar - Sekarang bisa diklik untuk membunyikan suara */}
      <div
        onClick={() => speakText(currentExercise.target, currentExercise.pinyin)}
        className={`cursor-pointer w-32 h-32 rounded-full border-4 flex items-center justify-center text-5xl mb-8 transition-all overflow-hidden bg-white/10 relative group ${mode === 'Leeloo' ? 'border-leeloo shadow-[0_0_40px_rgba(220,26,26,0.2)]' : 'border-shanti shadow-[0_0_40px_rgba(34,197,94,0.2)]'
          }`}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mode}&backgroundColor=transparent`} alt="AI Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-4xl text-white drop-shadow-lg">🔊</span>
        </div>
      </div>

      {/* Text Area */}
      <div className="text-center w-full max-w-sm mb-auto">
        {isRecording ? (
          <div className="mt-12">
            <p className="text-gray-400 text-sm mb-8">Ulangi apa yang kamu dengar</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black mb-2 tracking-widest">{currentExercise.target}</h2>
            <p className="text-gray-400 text-sm mb-4">{currentExercise.pinyin}</p>
            <p className="text-white text-base">{currentExercise.indonesian}</p>

            {/* Audio wave simulation */}
            <div className="flex items-center justify-center gap-1 mt-8 h-8">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-1 bg-white/30 rounded-full animate-pulse`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Primary Interaction Button */}
      <div className="w-full flex flex-col items-center mt-auto pb-8">
        <button
          onClick={handleMicClick}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-white text-black scale-110 shadow-[0_0_30px_white] mic-active' : 'bg-transparent border-2 border-white text-white hover:bg-white/10'
            }`}
        >
          <span className="text-3xl">{isRecording ? '⏹' : '🎤'}</span>
        </button>
        <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest">
          {isRecording ? 'Mendengarkan AI...' : 'Tekan mic dan bicara'}
        </p>

        {isRecording && (
          <button onClick={() => setIsRecording(false)} className="mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white">
            Batal
          </button>
        )}
      </div>

      {/* Feedback Overlay */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col p-6 items-center w-full max-w-md mx-auto border-x border-white/5">
          <div className="w-full flex justify-end mb-8">
            <div className="text-gray-400 font-bold text-sm">{currentIndex + 1}/{MOCK_EXERCISES.length}</div>
          </div>

          {feedbackType === 'salah' ? (
            <div className="w-full max-w-sm flex flex-col items-center flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-leeloo font-black text-xl mb-12">Belum tepat</h2>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left">
                <p className="text-gray-500 text-xs mb-2">Jawabanmu:</p>
                <p className="text-white text-lg">{currentExercise.wrongText.split(' (')[0]}</p>
                <p className="text-gray-400 text-sm">{currentExercise.wrongText.split('(')[1]?.replace(')', '')}</p>
              </div>

              <div className="w-full bg-leeloo/10 border border-leeloo/30 rounded-2xl p-4 mb-4 text-left">
                <p className="text-gray-500 text-xs mb-2">Koreksi:</p>
                <p className="text-leeloo text-lg font-bold">{currentExercise.target}</p>
                <p className="text-leeloo/80 text-sm">{currentExercise.pinyin}</p>
              </div>

              <div className="w-full text-left mt-4 mb-auto">
                <p className="text-gray-500 text-xs mb-1">Catatan AI:</p>
                <p className="text-white text-sm">{currentExercise.hint}</p>
              </div>

              <button onClick={handleUlangi} className="w-full bg-leeloo/20 text-leeloo py-4 rounded-2xl font-black text-center mt-auto flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span>↻</span> Ulangi Lagi
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm flex flex-col items-center flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-shanti font-black text-xl mb-8">Bagus!</h2>

              <div className="w-24 h-24 rounded-full border-4 border-shanti flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <span className="text-5xl text-shanti">✓</span>
              </div>

              <p className="text-white text-2xl font-bold mb-2">{currentExercise.target}</p>
              <p className="text-gray-400 text-base mb-12">{currentExercise.pinyin}</p>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center mb-auto">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Skor Pengucapan</p>
                <div className="w-20 h-20 rounded-full border-4 border-shanti flex items-center justify-center flex-col">
                  <span className="text-2xl font-black text-shanti">{Math.floor(Math.random() * 10) + 88}</span>
                  <span className="text-[10px] text-gray-500">/100</span>
                </div>
              </div>

              <button onClick={handleLanjut} className="w-full bg-shanti text-white py-4 rounded-2xl font-black text-center mt-auto flex items-center justify-center gap-2 active:scale-95 transition-transform">
                {isLastQuestion ? 'Selesai Sesi' : 'Lanjut'} <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
