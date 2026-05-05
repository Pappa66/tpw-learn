// app/beranda/page.tsx (Status Kesiapan - Mockup Screen 12)
import Link from 'next/link';

export default function Beranda() {
  return (
    <main className="p-6 flex flex-col min-h-[80vh] items-center justify-center text-center">
      <h1 className="text-xl font-black mb-8 tracking-widest text-gray-400 uppercase">Status Kesiapan</h1>
      
      <div className="w-56 h-64 relative flex flex-col items-center justify-center mb-8 mt-4">
        {/* SVG Circle Background */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="absolute inset-0 w-full h-full text-leeloo drop-shadow-[0_0_40px_rgba(220,26,26,0.3)]">
           <circle cx="12" cy="12" r="10" fill="rgba(220,26,26,0.05)"/>
        </svg>
        
        {/* Inner Content */}
        <div className="z-10 flex flex-col items-center mt-4">
          <div className="w-16 h-16 bg-leeloo rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(220,26,26,0.5)]">
            <span className="text-3xl text-white font-black">!</span>
          </div>
          <h2 className="text-4xl font-black text-leeloo tracking-widest uppercase">RISK</h2>
          <p className="text-xs text-leeloo/80 font-bold uppercase mt-1">Berisiko Tinggi</p>
        </div>
      </div>

      <p className="text-gray-400 mb-12 text-sm leading-relaxed max-w-xs">
        Peserta belum memenuhi standar komunikasi kerja. Diperlukan pelatihan segera untuk menghindari risiko miskomunikasi di lapangan.
      </p>

      <div className="w-full space-y-4 mt-auto">
        <Link href="/belajar" className="block w-full bg-leeloo text-white py-4 rounded-2xl font-black text-center active:scale-95 transition-transform shadow-[0_0_20px_rgba(220,26,26,0.3)]">
          MULAI PELATIHAN SEKARANG
        </Link>
        <button className="block w-full bg-white/5 text-gray-300 py-4 rounded-2xl font-black text-center border border-white/10 active:scale-95 transition-transform">
          LIHAT REKOMENDASI
        </button>
      </div>
    </main>
  );
}
