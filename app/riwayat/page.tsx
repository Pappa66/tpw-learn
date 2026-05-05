// app/riwayat/page.tsx (Ringkasan Harian & Progress Mingguan - Mockup Screen 9 & 10)
export default function Riwayat() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-black mb-6">Ringkasan Hari Ini</h1>
      
      {/* Screen 9 Component */}
      <div className="bg-gradient-to-b from-shanti/20 to-black border border-shanti/30 rounded-3xl p-6 mb-8 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Skor Harian</p>
        <div className="text-6xl font-black text-shanti mb-2">84</div>
        <p className="text-shanti text-sm mb-6">Bagus! Terus pertahankan.</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-3"><span className="text-xl">🎙️</span><span className="text-sm">Pengucapan</span></div>
            <span className="text-shanti font-bold">🎯 86</span>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-3"><span className="text-xl">⚡</span><span className="text-sm">Kecepatan Respon</span></div>
            <span className="text-white font-bold">🎯 80</span>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-3"><span className="text-xl">🧠</span><span className="text-sm">Ketepatan Makna</span></div>
            <span className="text-white font-bold">🎯 85</span>
          </div>
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-3"><span className="text-xl">🔄</span><span className="text-sm">Konsistensi</span></div>
            <span className="text-shanti font-bold">🎯 86</span>
          </div>
        </div>

        <button className="w-full mt-6 py-3 rounded-xl border border-white/20 text-sm font-bold active:scale-95 transition-transform">
          Lihat Detail
        </button>
      </div>

      <h2 className="text-xl font-black mb-6">Progress Mingguan</h2>
      
      {/* Screen 10 Component */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-gray-400 text-xs mb-1">Level Saat Ini</p>
            <p className="text-2xl font-black">Level 18</p>
            <p className="text-shanti text-xs">Siap Kerja Dasar</p>
          </div>
          <div className="text-right">
             <p className="text-gray-500 text-[10px]">ke Level 19</p>
             <p className="text-white text-xs font-bold mt-1">120/150</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mb-8">
          <div className="h-full bg-shanti rounded-full" style={{ width: '80%' }}></div>
        </div>

        {/* Mock Chart Area */}
        <div className="h-40 w-full relative border-l border-b border-white/10">
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
            {[20, 30, 45, 40, 60, 75, 85].map((val, i) => (
              <div key={i} className="w-2 bg-shanti rounded-t-sm" style={{ height: `${val}%` }}></div>
            ))}
          </div>
          {/* Chart labels */}
          <div className="absolute -bottom-6 w-full flex justify-between px-2 text-[8px] text-gray-500">
             <span>M1</span><span>M2</span><span>M3</span><span>M4</span><span>M5</span><span>M6</span><span>M7</span>
          </div>
        </div>
      </div>
    </main>
  );
}
