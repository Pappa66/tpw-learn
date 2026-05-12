"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SpeechService } from "@/services/SpeechService";
import ChatPanel from "@/components/ChatPanel";
import Avatar from "@/components/Avatar";

export default function ExercisePage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const router = useRouter();
  const sp = useSearchParams();
  const resolvedParams = use(params);
  const [mode, setMode] = useState<"Leeloo" | "Shanti" | null>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const topic = resolvedParams.scenarioId.replace(/-/g, " ");
  const lang = sp.get("lang") || "mandarin-taiwan";

  useEffect(() => {
    fetch("/api/scenario?topic=" + encodeURIComponent(topic) + "&lang=" + encodeURIComponent(lang))
      .then((r) => r.json())
      .then(setScenario)
      .catch(() => setScenario([]))
      .finally(() => setIsLoading(false));
  }, [topic, lang]);

  const playAudio = (text: string) => { if (mode) SpeechService.speak(text, mode); };
  const handleExit = () => router.push("/belajar");
  const selectMode = (s: "Leeloo" | "Shanti") => { setMode(s); setShowChat(true); setChatKey((p) => p + 1); };

  if (isLoading) return (
    <div className="h-dvh flex items-center justify-center bg-black">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-gray-500" />
    </div>
  );

  if (!mode) return (
    <div className="h-dvh bg-black flex flex-col">
      <header className="shrink-0 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 h-14 flex items-center">
        <button onClick={() => router.push("/belajar")} className="text-gray-400 hover:text-white text-sm font-bold mr-auto">← Kembali</button>
        <h1 className="text-sm font-bold capitalize truncate mx-2">{topic}</h1>
        <button onClick={handleExit} className="text-gray-500 hover:text-white text-xl ml-auto">✕</button>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
        <h2 className="text-lg font-bold mb-2">Pilih Mode Belajar</h2>
        <p className="text-gray-400 text-sm mb-6 text-center max-w-xs">
          Program: <span className="font-bold text-white">{lang.replace("-", " ").toUpperCase()}</span>
        </p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <button onClick={() => selectMode("Leeloo")} className="bg-red-950/40 border-2 border-red-500/40 rounded-2xl p-5 text-center hover:bg-red-950/60 transition active:scale-95">
            <Avatar mode="Leeloo" size="sm" />
            <h3 className="text-red-400 font-black text-base mt-2">Leeloo</h3>
            <p className="text-gray-500 text-[10px] mt-1">Tegas, menantang</p>
          </button>
          <button onClick={() => selectMode("Shanti")} className="bg-green-950/40 border-2 border-green-500/40 rounded-2xl p-5 text-center hover:bg-green-950/60 transition active:scale-95">
            <Avatar mode="Shanti" size="sm" />
            <h3 className="text-green-400 font-black text-base mt-2">Shanti</h3>
            <p className="text-gray-500 text-[10px] mt-1">Lembut, sabar</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-dvh bg-black flex flex-col overflow-hidden">
      <header className="shrink-0 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <button onClick={() => router.push("/belajar")} className="text-gray-400 hover:text-white text-sm font-bold">← Kembali</button>
        <h1 className="text-sm font-bold capitalize truncate mx-2">{topic}</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 mr-1">{lang.replace("-", " ").toUpperCase()}</span>
          <span className={"text-[10px] font-bold px-2 py-1 rounded-full border " + (mode === "Leeloo" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-green-500/10 text-green-400 border-green-500/40")}>{mode}</span>
          <button onClick={handleExit} className="text-gray-500 hover:text-white text-lg">✕</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full min-h-0">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col items-center">
          {scenario && scenario.length > 0 ? (
            <div className="w-full max-w-lg space-y-5">
              {scenario.slice(0, 1).map((item: any, i: number) => (
                <div key={i} className="text-center space-y-3">
                  <div className={"mx-auto " + (mode === "Leeloo" ? "drop-shadow-[0_0_12px_rgba(220,26,26,0.4)]" : "drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]")}>
                    <Avatar mode={mode} size="lg" />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{item.target}</h2>
                    {item.pinyin && <p className="text-gray-400 italic font-mono text-lg mt-2">{item.pinyin}</p>}
                    <p className="text-gray-500 font-medium mt-1">{item.indonesian}</p>
                  </div>
                  <button onClick={() => playAudio(item.target)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition">🔊 Dengarkan</button>
                </div>
              ))}
              <div className="border-t border-white/10 pt-5 mt-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Latihan Lainnya</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scenario.slice(1).map((item: any, i: number) => (
                    <button key={i} onClick={() => playAudio(item.target)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
                      <span className="text-lg">{item.target}</span>
                      <span className="text-xs text-gray-500 truncate">{item.indonesian}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Tidak ada materi untuk skenario ini.</div>
          )}
        </div>

        <div className="lg:w-[420px] lg:border-l border-white/10 flex flex-col min-h-0">
          <div className="hidden lg:flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">AI Tutor — {mode}</span>
            <button onClick={() => setShowChat(!showChat)} className="text-xs text-gray-400 hover:text-white">{showChat ? "Sembunyikan" : "Tampilkan"}</button>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            {showChat ? (
              <ChatPanel key={chatKey} embedded initialPersona={mode} showExit onExit={handleExit} language={lang} initialTarget={scenario?.[0]?.target} initialPinyin={scenario?.[0]?.pinyin} initialIndonesian={scenario?.[0]?.indonesian} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">Klik "Tampilkan" untuk membuka chat</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
