// app/status/page.tsx (Mockup 12 - Status Kesiapan Final)
import Link from 'next/link';

export default function StatusKesiapan() {
  return (
    <main className="p-6 flex flex-col min-h-screen items-center justify-center text-center bg-black">
      <h1 className="text-xl font-bold mb-12 tracking-wide text-white">Status Kesiapan</h1>
      
      <div className="w-full max-w-[280px] aspect-[4/5] relative flex flex-col items-center justify-center mb-12 mx-auto">
        {/* SVG Shield Background */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="absolute inset-0 w-full h-full text-shanti drop-shadow-[0_0_50px_rgba(34,197,94,0.3)]">
           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(34,197,94,0.15)"/>
        </svg>
        
        {/* Inner Content */}
        <div className="z-10 flex flex-col items-center -mt-8">
          <div className="w-12 h-12 bg-shanti rounded-md flex items-center justify-center mb-4 shadow-lg shadow-shanti/50" style={{ clipPath: 'polygon(50% 0%, 100% 0, 100% 70%, 50% 100%, 0 70%, 0 0)' }}>
            <span className="text-2xl text-white font-black">✓</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-widest">READY</h2>
          <p className="text-xs text-shanti font-bold mt-1">Siap & Stabil</p>
        </div>
      </div>

      <p className="text-white mb-auto text-sm leading-relaxed max-w-xs">
        Peserta siap berangkat dengan risiko rendah dan komunikasi stabil.
      </p>

      <div className="w-full mt-12 pb-8">
        <button className="block w-full bg-white/5 text-white py-4 rounded-2xl font-bold text-center border border-white/10 active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span className="text-shanti text-xl">📄</span> Lihat Rekomendasi
        </button>
        <Link href="/beranda" className="block w-full mt-4 text-gray-500 text-xs font-bold uppercase tracking-widest text-center hover:text-white">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
