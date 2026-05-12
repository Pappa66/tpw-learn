"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SpeechService } from "@/services/SpeechService";
import { AudioRecorderService } from "@/services/AudioRecorderService";
import Avatar from "@/components/Avatar";

type Persona = "Leeloo" | "Shanti";
interface Message { role: "ai" | "user"; text: string; score?: number; exerciseTarget?: string; }
interface ChatPanelProps { embedded?: boolean; showExit?: boolean; onExit?: () => void; initialPersona?: Persona; language?: string; initialTarget?: string; initialPinyin?: string; initialIndonesian?: string; }

const LOADING_TEXTS: Record<Persona, string[]> = { Leeloo: ["Leeloo menyiapkan...", "Leeloo milihin kata..."], Shanti: ["Shanti menyiapkan...", "Sebentar ya..."] };

function fetchWithTimeout(url: string, opts: any, ms = 20000): Promise<Response> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return fetch(url, { ...opts, signal: c.signal }).finally(() => clearTimeout(t));
}

export default function ChatPanel({ embedded, showExit, onExit, initialPersona, language, initialTarget, initialPinyin, initialIndonesian }: ChatPanelProps) {
  const [persona, setPersona] = useState<Persona>(initialPersona || "Shanti");
  const [min, setMin] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [rec, setRec] = useState(false);
  const [load, setLoad] = useState(false);
  const [ex, setEx] = useState<string | null>(null);
  const [recDur, setRecDur] = useState(0);
  const [txt, setTxt] = useState("");
  const [loadTxt, setLoadTxt] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<AudioRecorderService | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const add = useCallback((text: string, target?: string, score?: number) => {
    setMsgs((p) => [...p, { role: "ai", text, score, exerciseTarget: target }]);
  }, []);

  const play = (t: string) => SpeechService.speak(t, persona).catch(() => {});

  const setLoadSafe = (v: boolean) => {
    setLoad(v);
    if (v) setLoadTxt(LOADING_TEXTS[persona][Math.floor(Math.random() * LOADING_TEXTS[persona].length)]);
  };

  const callAI = async (userText: string, targetText?: string, dur?: number) => {
    setLoadSafe(true);
    try {
      const res = await fetchWithTimeout("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, userText, targetText, recordingDurationMs: dur || 0, language }),
      });
      const d = await res.json();
      add(d.message, d.exercise?.target, d.fluency?.totalScore);
      if (d.exercise?.target) { setEx(d.exercise.target); setTimeout(() => play(d.exercise.target), 300); }
      else setEx(null);
    } catch { add("Error. Coba lagi."); setEx(null); } finally { setLoadSafe(false); }
  };

  const startNew = () => {
    if (initialTarget) {
      const m = initialIndonesian ? "Coba ucapkan: " + initialTarget + " (" + initialPinyin + ") - " + initialIndonesian : "Coba ucapkan: " + initialTarget;
      add(m, initialTarget); setEx(initialTarget); setTimeout(() => play(initialTarget), 300);
    } else {
      callAI("Mulai");
    }
  };

  const toggleRec = async () => {
    if (rec) {
      clearInterval(timerRef.current); setRec(false);
      if (!recRef.current) return;
      try {
        const blob = await recRef.current.stop();
        add("🎤", undefined);
        setLoadSafe(true);
        const fd = new FormData();
        fd.append("audio", blob, "r.wav");
        const l = language?.includes("jepang") ? "ja" : language?.includes("mandarin") ? "zh" : "";
        fd.append("language", l);
        const stt = await fetchWithTimeout("/api/stt", { method: "POST", body: fd }, 25000);
        const sttData = await stt.json();
        const t = sttData.text || "";
        if (!t) { add("Tidak terdeteksi."); setLoadSafe(false); return; }
        setMsgs((p) => { const c = [...p]; c[c.length-1] = { role: "user", text: t }; return c; });
        if (ex) await callAI(t, ex, recDur * 1000);
        else setLoadSafe(false);
      } catch { add("Error suara."); setLoadSafe(false); }
    } else {
      try {
        const r = new AudioRecorderService(); recRef.current = r; await r.start();
        setRec(true); setRecDur(0);
        timerRef.current = setInterval(() => setRecDur((p) => p + 1), 1000);
      } catch { alert("Gagal mikrofon"); }
    }
  };

  const send = async () => {
    if (!txt.trim()) return;
    add(txt); setTxt("");
    if (ex) await callAI(txt, ex, 3000);
    else await callAI(txt);
  };

  const toggleP = () => {
    const n = persona === "Leeloo" ? "Shanti" : "Leeloo";
    setPersona(n); setMsgs([]); setEx(null); setMin(false);
    setTimeout(() => startNew(), 300);
  };

  const p = persona === "Leeloo" ? "red" : "green";
  const bh = persona === "Leeloo" ? "bg-red-600" : "bg-green-600";
  const bg = persona === "Leeloo" ? "bg-red-950/30" : "bg-green-950/30";

  if (!embedded && min) return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setMin(false)} className={"flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl " + bh + " text-white font-bold text-xs hover:scale-105"}>
        <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" /> {persona}
      </button>
    </div>
  );

  if (embedded && min) return (
    <div className="w-full border-t border-white/10">
      <button onClick={() => setMin(false)} className={"w-full flex items-center justify-between px-4 py-2.5 " + bh + " text-white"}>
        <span className="font-bold text-xs flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" /> {persona} — Chat</span>
        <span className="text-[10px] text-white/70">▲ Buka</span>
      </button>
    </div>
  );

  return (
    <div className={embedded ? "w-full flex flex-col border-t border-white/10 h-full min-h-0" : "fixed bottom-4 right-4 z-50"}>
      <div className={embedded ? "flex flex-col h-full min-h-0 " + bg : "w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border shadow-2xl flex flex-col overflow-hidden " + bg + " border-" + p + "-500/40"}>
        <div className={"flex items-center justify-between px-3 py-2 " + bh + " text-white shrink-0"}>
          <div className="flex items-center gap-2">
            <button onClick={toggleP} className="opacity-60 hover:opacity-100"><Avatar mode={persona} size="sm" /></button>
            <span className="font-bold text-sm">{persona}</span>
            {language && <span className="text-[10px] text-white/50">{language.replace("-", " ").toUpperCase()}</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={startNew} className="text-[10px] opacity-60 hover:opacity-100 px-2 py-0.5 rounded bg-white/10">✦ Baru</button>
            {showExit && onExit && <button onClick={onExit} className="text-xs opacity-60 hover:opacity-100">✕</button>}
            <button onClick={() => setMin(true)} className="text-lg leading-none opacity-60 hover:opacity-100">─</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
          {msgs.length === 0 && !load && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-4 py-10">
              <Avatar mode={persona} size="md" />
              <p className="text-center">Mulai latihan dengan tekan tombol di bawah</p>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={"max-w-[85%] rounded-2xl px-3.5 py-2 " + (m.role === "user" ? "bg-white/10 text-white rounded-br-md" : (persona === "Leeloo" ? "bg-red-950/60 border border-red-800/30" : "bg-green-950/60 border border-green-800/30") + " text-white rounded-bl-md")}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.score !== undefined && (
                  <div className={"mt-1 text-xs font-bold " + (m.score >= 70 ? "text-green-400" : m.score >= 40 ? "text-yellow-400" : "text-red-400")}>
                    Skor: {m.score}/100
                  </div>
                )}
                {m.exerciseTarget && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/10">
                    <p className="text-base font-bold tracking-wider text-center">{m.exerciseTarget}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {load && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl px-4 py-2.5 rounded-bl-md"><p className="text-gray-400 text-sm">{loadTxt}</p></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-3 border-t border-white/10 shrink-0 space-y-2 bg-[#0a0a0a]">
          {ex ? (
            <div className="flex gap-2">
              <button onClick={() => play(ex)} disabled={load}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition disabled:opacity-50">🔊 Dengarkan</button>
              <button onClick={toggleRec} disabled={load}
                className={"flex-1 py-2.5 rounded-xl text-sm font-bold transition " + (rec ? "bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/10 text-white hover:bg-white/20") + " disabled:opacity-50"}>
                {rec ? "⏹ " + recDur + "s" : "🎤 Rekam"}
              </button>
            </div>
          ) : !load && (
            <button onClick={startNew}
              className="w-full py-3 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition border border-white/20">🚀 Mulai Latihan</button>
          )}
          <div className="flex gap-2">
            <input value={txt} onChange={(e) => setTxt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ketik jawaban..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30" />
            <button onClick={send} disabled={!txt.trim() || load}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition disabled:opacity-30">Kirim</button>
          </div>
        </div>
      </div>
    </div>
  );
}
