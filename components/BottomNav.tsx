"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/exercise") || pathname === "/") return null;

  const menu = [
    { name: "Beranda", path: "/beranda", icon: "🏠" },
    { name: "Belajar", path: "/belajar", icon: "📚" },
    { name: "Riwayat", path: "/riwayat", icon: "⏱️" },
    { name: "Profil", path: "/profil", icon: "👤" },
  ];

  return (
    <nav className="sticky bottom-0 w-full max-w-md lg:max-w-6xl xl:max-w-7xl mx-auto bg-black/90 backdrop-blur-md border-t border-white/10 z-40 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex justify-around items-center h-16 px-2">
        {menu.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/");
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? "text-shanti" : "text-gray-500"
              }`}
            >
              <span className={`text-xl ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
              <span className={`text-[10px] font-bold ${isActive ? "text-shanti" : "text-gray-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
