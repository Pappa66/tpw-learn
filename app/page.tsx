// app/page.tsx (Splash Screen - Mockup Screen 1)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman Beranda setelah 3 detik
    const timer = setTimeout(() => {
      router.push('/beranda');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-[100vh] bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background waves */}
      <div className="absolute bottom-16 left-0 w-full h-40 opacity-20">
         <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full fill-current text-[#eab308]">
            <path d="M0 10 Q 25 20, 50 10 T 100 10 L 100 20 L 0 20 Z" />
            <path d="M0 15 Q 25 5, 50 15 T 100 15 L 100 20 L 0 20 Z" opacity="0.3"/>
            <path d="M0 18 Q 25 20, 50 18 T 100 18 L 100 20 L 0 20 Z" opacity="0.1"/>
         </svg>
      </div>

      <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2">
          TPW<span className="text-[#eab308]">LEARN</span>
        </h1>
        <p className="text-gray-400 text-sm tracking-widest mt-6">Train to survive,</p>
        <p className="text-gray-400 text-sm tracking-widest mt-1">not to memorize.</p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-12 w-3/4 max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#eab308] rounded-full animate-[loading_3s_ease-in-out_forwards]" style={{ width: '0%' }}></div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </main>
  );
}