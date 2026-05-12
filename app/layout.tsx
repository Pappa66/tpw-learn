import "./globals.css";
import BottomNav from "@/components/BottomNav";
import FloatingChat from "@/components/FloatingChat";

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
                    leeloo: "#dc1a1a",
                    shanti: "#22c55e",
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-black text-white antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <div className="mx-auto w-full max-w-md lg:max-w-6xl xl:max-w-7xl min-h-screen relative flex flex-col shadow-2xl lg:shadow-none border-x border-white/5 lg:border-0">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <BottomNav />
        </div>
        <FloatingChat />
      </body>
    </html>
  );
}
