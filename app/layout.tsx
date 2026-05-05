import "./globals.css";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    leeloo: '#dc1a1a',
                    shanti: '#22c55e',
                  }
                }
              }
            }
          `
        }} />
      </head>

      <body className="bg-black text-white antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        {/* Kontainer utama untuk mensimulasikan layar mobile di desktop */}
        <div className="mx-auto w-full max-w-md bg-[#0a0a0a] min-h-screen relative flex flex-col shadow-2xl border-x border-white/5">
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}