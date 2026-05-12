"use server";

import { countSyllables, countUtterances, estimateSilentPauses } from "@/lib/helpers/syllable-counter";
import db from "@/lib/db";
import type { CEFRLevel, ACTFLLevel, FluencyMetrics } from "@/lib/types";
import { cefrToScore } from "@/lib/types";

interface FluencyInput {
  userText: string;
  targetText: string;
  recordingDurationMs: number;
  userId?: number;
  mode?: string;
}

const CEFR_MLU: Record<CEFRLevel, [number, number]> = {
  A1: [0, 3.0], A2: [3.0, 4.5], B1: [4.5, 6.0],
  B2: [6.0, 7.5], C1: [7.5, 9.5], C2: [9.5, Infinity],
};
const CEFR_ART: Record<CEFRLevel, [number, number]> = {
  A1: [0, 1.5], A2: [1.5, 2.5], B1: [2.5, 3.5],
  B2: [3.5, 4.5], C1: [4.5, 5.5], C2: [5.5, Infinity],
};
const CEFR_PAUSE: Record<CEFRLevel, [number, number]> = {
  A1: [12, Infinity], A2: [8, 12], B1: [5, 8],
  B2: [3, 5], C1: [1, 3], C2: [0, 1],
};
const ACTFL_MAP: Record<CEFRLevel, ACTFLLevel> = {
  A1: "Novice Mid", A2: "Novice High", B1: "Intermediate Low",
  B2: "Intermediate High", C1: "Advanced Low", C2: "Advanced High",
};

function normalize(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 96)
  ).toLowerCase().trim();
}

function contentAccuracy(user: string, target: string): number {
  const u = normalize(user);
  const t = normalize(target);
  if (!u || !t) return 0;
  if (u === t) return 1;

  let match = 0;
  for (const ch of u) { if (t.includes(ch)) match++; }
  const lenRatio = Math.min(u.length, t.length) / Math.max(u.length, 1);
  const overlap = match / Math.max(u.length, 1);

  return Math.min(overlap * 0.5 + lenRatio * 0.3 + (u === t ? 0.2 : 0), 1);
}

function scoreToCEFR(mlu: number, art: number, pause: number): CEFRLevel {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const m = levels.findIndex((l) => { const [mn, mx] = CEFR_MLU[l]; return mlu >= mn && mlu < mx; });
  const a = levels.findIndex((l) => { const [mn, mx] = CEFR_ART[l]; return art >= mn && art < mx; });
  const p = levels.findIndex((l) => { const [mn, mx] = CEFR_PAUSE[l]; return pause >= mn && pause < mx; });
  return levels[Math.max(0, Math.min(Math.round(m * 0.5 + a * 0.25 + p * 0.25), 5))];
}

export async function analyzeFluency(input: FluencyInput): Promise<FluencyMetrics> {
  const durSec = input.recordingDurationMs / 1000;
  const syl = countSyllables(input.userText);
  const utt = countUtterances(input.userText);
  const art = durSec > 0 ? syl / durSec : 0;
  const mlu = utt > 0 ? syl / utt : 0;
  const rawPause = estimateSilentPauses(input.userText, input.recordingDurationMs);
  const pause = durSec > 0 ? (rawPause / durSec) * 60 : 0;
  const cefr = scoreToCEFR(mlu, art, pause);
  const actfl = ACTFL_MAP[cefr];
  const baseScore = cefrToScore(cefr);
  const accuracy = contentAccuracy(input.userText, input.targetText);
  const finalScore = Math.round(baseScore * Math.max(accuracy, 0.15));

  if (input.userId) {
    try {
      db.prepare(
        "INSERT INTO Assessment (userId, articulationRate, mlu, silentPauseFreq, totalScore, cefrLevel, actflLevel) VALUES (?,?,?,?,?,?,?)"
      ).run(input.userId, Math.round(art * 100) / 100, Math.round(mlu * 100) / 100, Math.round(pause * 100) / 100, finalScore, cefr, actfl);
    } catch {}
  }

  return { articulationRate: Math.round(art * 100) / 100, mlu: Math.round(mlu * 100) / 100, silentPauseFreq: Math.round(pause * 100) / 100, totalScore: finalScore, cefrLevel: cefr, actflLevel: actfl };
}

export async function getFluencyHistory(userId: number) {
  return db.prepare("SELECT * FROM Assessment WHERE userId = ? ORDER BY createdAt DESC LIMIT 50").all(userId);
}

export async function getLatestAssessments(userId: number) {
  return db.prepare("SELECT * FROM Assessment WHERE userId = ? ORDER BY createdAt DESC LIMIT 2").all(userId);
}
