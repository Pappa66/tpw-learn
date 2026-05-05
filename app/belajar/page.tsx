// app/belajar/page.tsx (Pilih Program - Mockup Screen 2)
import Link from 'next/link';

export default function PilihProgram() {
  // Skeleton / Mock Data untuk Program
  const programs = [
    { id: 'mandarin-taiwan', name: 'Mandarin – Taiwan', desc: 'Caregiver / Operator', icon: '🇹🇼' },
    { id: 'jepang', name: 'Jepang', desc: 'Kerja & Industri', icon: '🇯🇵' },
    { id: 'teknisi', name: 'Teknisi', desc: 'Komunikasi Kerja', icon: '🛠️' },
    { id: 'survival', name: 'Survival Umum', desc: 'Situasi Sehari-hari', icon: '💬' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-black mb-2">Pilih Program</h1>
      <p className="text-gray-400 text-sm mb-8">Pilih negara dan program pelatihanmu</p>
      
      <div className="flex flex-col gap-4">
        {programs.map((prog) => (
          <Link key={prog.id} href={`/belajar/${prog.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center text-2xl">
              {prog.icon}
            </div>
            <div>
              <h2 className="font-bold text-lg">{prog.name}</h2>
              <p className="text-gray-500 text-xs">{prog.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
