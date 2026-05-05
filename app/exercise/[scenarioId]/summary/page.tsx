// app/exercise/[scenarioId]/summary/page.tsx (Progress Session - Mockup Screen 8)
import Link from 'next/link';

export default function SessionSummary() {
  return (
    <main className="p-6 flex flex-col min-h-screen">
      <h1 className="text-xl font-black mb-8 text-center mt-4">Sesi Hari Ini</h1>
      
      <div className="flex flex-col items-center mb-12">
        <div className="w-48 h-48 rounded-full border-8 border-white/10 relative flex items-center justify-center">
          {/* Progress arc simulation */}
          <div className="absolute inset-0 rounded-full border-8 border-shanti border-t-transparent border-l-transparent rotate-45"></div>
          <div className="text-center">
            <span className="text-5xl font-black block">6/10</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1 block">Selesai</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
          <p className="text-gray-500 text-xs mb-1">Benar</p>
          <p className="text-2xl font-black text-shanti">4</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
          <p className="text-gray-500 text-xs mb-1">Hampir</p>
          <p className="text-2xl font-black text-yellow-500">1</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
          <p className="text-gray-500 text-xs mb-1">Salah</p>
          <p className="text-2xl font-black text-leeloo">1</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-auto">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
          <p className="text-gray-500 text-xs mb-1">Waktu Sesi</p>
          <p className="text-xl font-bold">12:45</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
          <p className="text-gray-500 text-xs mb-1">Skor Rata-rata</p>
          <p className="text-xl font-bold">82</p>
        </div>
      </div>

      <div className="mt-auto">
        <Link href="/belajar" className="block w-full border border-leeloo text-leeloo py-4 rounded-2xl font-black text-center active:scale-95 transition-transform bg-leeloo/10">
          <span className="mr-2">⏹</span> Akhiri Sesi
        </Link>
      </div>
    </main>
  );
}
