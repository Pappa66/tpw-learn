export default function UnderDevelopment({ title }: { title: string }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-yellow-500/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
      <span className="text-4xl mb-2">🚧</span>
      <h3 className="text-lg font-bold text-yellow-500">{title}</h3>
      <p className="text-sm text-gray-400">Fitur ini sedang dalam tahap pengembangan intensif.</p>
    </div>
  );
}