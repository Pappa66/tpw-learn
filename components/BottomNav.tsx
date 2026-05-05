'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  
  // Sembunyikan BottomNav di halaman exercise (Mode Latihan) dan Splash Screen
  if (pathname.startsWith('/exercise') || pathname === '/') return null;

  const menu = [
    { name: 'Beranda', path: '/beranda', icon: '🏠' },
    { name: 'Belajar', path: '/belajar', icon: '📚' },
    { name: 'Riwayat', path: '/riwayat', icon: '⏱️' },
    { name: 'Profil', path: '/profil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-black/90 backdrop-blur-md border-t border-white/10 z-40 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {menu.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-shanti' : 'text-gray-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
