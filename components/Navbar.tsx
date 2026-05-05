'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const menu = [
    { name: 'Beranda', path: '/' },
    { name: 'Latihan', path: '/exercise' },
    { name: 'Laporan', path: '/report' },
    { name: 'Sesi', path: '/sessions' },
  ];

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-black tracking-tighter text-xl">TPW<span className="text-leeloo">LEARN</span></span>
        <div className="flex gap-6">
          {menu.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`text-[10px] uppercase font-bold tracking-widest ${pathname === item.path ? 'text-leeloo' : 'text-gray-500'}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}