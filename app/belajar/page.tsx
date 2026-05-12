import Link from "next/link";

const programs = [
  { id: "mandarin-taiwan", name: "Mandarin – Taiwan", desc: "Caregiver / Operator", icon: "🇹🇼", available: true },
  { id: "jepang", name: "Jepang", desc: "Kerja & Industri", icon: "🇯🇵", available: true },
  { id: "teknisi", name: "Teknisi", desc: "Komunikasi Kerja", icon: "🛠️", available: false },
  { id: "survival", name: "Survival Umum", desc: "Situasi Sehari-hari", icon: "💬", available: false },
];

function ProgramCard({ prog }: { prog: typeof programs[number] }) {
  if (!prog.available) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 opacity-50 cursor-not-allowed">
        <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center text-2xl grayscale">
          {prog.icon}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-gray-500">{prog.name}</h2>
          <p className="text-gray-600 text-xs">{prog.desc}</p>
        </div>
        <span className="text-[8px] font-bold text-yellow-600 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded">
          Segera
        </span>
      </div>
    );
  }

  return (
    <Link
      href={`/belajar/${prog.id}`}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform hover:border-white/20"
    >
      <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center text-2xl">
        {prog.icon}
      </div>
      <div>
        <h2 className="font-bold text-lg">{prog.name}</h2>
        <p className="text-gray-500 text-xs">{prog.desc}</p>
      </div>
    </Link>
  );
}

export default function PilihProgram() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-black mb-2">Pilih Program</h1>
      <p className="text-gray-400 text-sm mb-8">Pilih negara dan program pelatihanmu</p>
      <div className="flex flex-col gap-4">
        {programs.map((prog) => (
          <ProgramCard key={prog.id} prog={prog} />
        ))}
      </div>
    </main>
  );
}
