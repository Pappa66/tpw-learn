"use server";

import db from "@/lib/db";
import { analyzeFluency } from "@/lib/actions/fluency";
import { generateContent } from "@/lib/ai";
import { getDefaultChat } from "@/lib/fallbacks";
import type { FluencyMetrics } from "@/lib/types";

type Persona = "Leeloo" | "Shanti";
interface ChatRequest { persona: Persona; userText: string; targetText?: string; recordingDurationMs?: number; userId?: number; language?: string; }
interface ChatResponse { message: string; exercise?: { target: string }; fluency?: FluencyMetrics; isExercise: boolean; }

function langName(l?: string): string { return l?.includes("jepang") ? "Bahasa Jepang" : "Bahasa Mandarin"; }

function parseNext(ai: string, fb: string): string {
  if (ai.includes("||")) { const p = ai.split("||"); return p[1]?.trim() || fb; }
  const ni = ai.toLowerCase().indexOf("next");
  if (ni !== -1) return ai.substring(ni + 4).replace(/["":]/g, "").trim() || fb;
  if (ai.length > 2 && ai.length < 40) return ai.trim();
  return fb;
}

export async function chatWithAI(req: ChatRequest): Promise<ChatResponse> {
  const userId = req.userId || 1;
  const ln = langName(req.language);
  const lastRow = db.prepare("SELECT cefrLevel FROM Assessment WHERE userId = ? ORDER BY createdAt DESC LIMIT 1").get(userId) as any;
  const lastLevel = lastRow?.cefrLevel || "A1";

  if (!req.targetText) {
    const def = getDefaultChat(req.persona, req.language);
    db.prepare("INSERT INTO History (userId,mode,target,userText,score,feedback) VALUES (?,?,?,?,?,?)").run(userId, req.persona, def.target, req.userText, 0, def.message);
    return { message: def.message, exercise: { target: def.target }, isExercise: true };
  }

  const fluency = await analyzeFluency({ userText: req.userText, targetText: req.targetText, recordingDurationMs: req.recordingDurationMs || 3000, userId, mode: req.persona });
  const style = req.persona === "Leeloo" ? "GALAK" : "lembut";
  const qt = String.fromCharCode(34);
  const prompt = "Kamu " + req.persona + " instruktur " + ln + ". " + style + ". User: " + qt + req.targetText + qt + " jawab: " + qt + req.userText + qt + " Skor: " + fluency.totalScore + "/100. Jika skor >= 75: feedback||target_baru. Jika skor < 75: feedback||" + req.targetText;

  const aiResponse = await generateContent(prompt);
  const aiNext = parseNext(aiResponse, req.targetText);
  const msg = req.persona === "Leeloo"
    ? (fluency.totalScore < 30 ? "SALAH!" : fluency.totalScore < 55 ? "Kurang!" : fluency.totalScore < 75 ? "Lumayan" : "OK lanjut!")
    : (fluency.totalScore < 30 ? "Pelan-pelan ya." : fluency.totalScore < 55 ? "Coba lagi." : fluency.totalScore < 75 ? "Mendekati!" : "Bagus! 👍");

  db.prepare("INSERT INTO History (userId,mode,target,userText,score,feedback) VALUES (?,?,?,?,?,?)").run(userId, req.persona, req.targetText, req.userText, Math.round(fluency.totalScore), msg);
  const label = aiNext === req.targetText ? "Coba lagi" : "Lanjut";
  return { message: msg + "\n\n" + label + ': "' + aiNext + '"', exercise: { target: aiNext }, fluency, isExercise: true };
}
