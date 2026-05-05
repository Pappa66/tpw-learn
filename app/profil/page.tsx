// app/profil/page.tsx (Laporan Peserta - Mockup Screen 11)
import Link from 'next/link';

export default function Profil() {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black">Laporan Peserta</h1>
        <span className="text-gray-500 text-xl">⚙️</span>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" alt="Ahmad" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Ahmad Fauzi</h2>
          <p className="text-gray-400 text-sm">ID: TPW-2026-0505</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
          <p className="text-gray-500 text-[10px] mb-1">Program</p>
          <p className="text-xs font-bold">Mandarin - Taiwan</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
          <p className="text-gray-500 text-[10px] mb-1">Durasi</p>
          <p className="text-xs font-bold">30 Hari</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
          <p className="text-gray-500 text-[10px] mb-1">Total Jam</p>
          <p className="text-xs font-bold">120 Jam</p>
        </div>
      </div>

      <h3 className="font-bold text-sm mb-4">Hasil Akhir</h3>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-shanti flex items-center justify-center text-shanti font-bold mb-2">88</div>
            <p className="text-[10px] text-gray-400">Komunikasi</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-shanti flex items-center justify-center text-shanti font-bold mb-2">95</div>
            <p className="text-[10px] text-gray-400">Disiplin</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-shanti flex items-center justify-center text-shanti font-bold mb-2">94</div>
            <p className="text-[10px] text-gray-400">Konsistensi</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-shanti flex items-center justify-center text-shanti font-bold mb-2">90</div>
            <p className="text-[10px] text-gray-400">Inisiatif</p>
          </div>
        </div>

        <Link href="/status" className="border-t border-white/10 pt-6 flex flex-col items-center active:scale-95 transition-transform hover:bg-white/5 rounded-b-2xl cursor-pointer block w-full">
          <p className="text-gray-500 text-xs mb-1">Final Score</p>
          <p className="text-5xl font-black text-shanti mb-1">91</p>
          <p className="text-shanti text-xs font-bold tracking-widest">READY <span className="text-gray-500 text-[10px] ml-1">👁️ Lihat Sertifikat</span></p>
        </Link>
      </div>
    </main>
  );
}
