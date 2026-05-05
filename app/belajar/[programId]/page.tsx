// app/belajar/[programId]/page.tsx (Pilih Skenario - Mockup Screen 3)
import Link from 'next/link';

export default async function PilihSkenario({ params }: { params: Promise<{ programId: string }> }) {
  const resolvedParams = await params;
  
  // Skeleton / Mock Data untuk Skenario
  const scenarios = [
    { id: 'instruksi-kerja', name: 'Instruksi Kerja', desc: 'Mendengar & melaksanakan', icon: '📋' },
    { id: 'komunikasi-darurat', name: 'Komunikasi Darurat', desc: 'Situasi mendesak', icon: '🚨' },
    { id: 'tekanan-teguran', name: 'Tekanan & Teguran', desc: 'Dimarahin atasan', icon: '😠' },
    { id: 'sehari-hari', name: 'Percakapan Sehari-hari', desc: 'Interaksi umum', icon: '🗣️' },
    { id: 'tanya-klarifikasi', name: 'Tanya & Klarifikasi', desc: 'Tidak mengerti / tanya ulang', icon: '❓' },
  ];

  return (
    <main className="p-6">
      <Link href="/belajar" className="inline-flex items-center text-gray-400 text-sm font-bold mb-6 hover:text-white">
        ← Kembali
      </Link>
      
      <h1 className="text-2xl font-black mb-2">Pilih Skenario</h1>
      <p className="text-gray-400 text-sm mb-8">Pilih situasi yang ingin kamu latihan untuk program {resolvedParams.programId}</p>
      
      <div className="flex flex-col gap-4">
        {scenarios.map((scen) => (
          <Link key={scen.id} href={`/exercise/${scen.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black/50 rounded-xl flex items-center justify-center text-xl">
                {scen.icon}
              </div>
              <div>
                <h2 className="font-bold text-base">{scen.name}</h2>
                <p className="text-gray-500 text-xs">{scen.desc}</p>
              </div>
            </div>
            <span className="text-gray-600">›</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
