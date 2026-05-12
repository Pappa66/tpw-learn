export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ACTFLLevel =
  | "Novice Low"
  | "Novice Mid"
  | "Novice High"
  | "Intermediate Low"
  | "Intermediate Mid"
  | "Intermediate High"
  | "Advanced Low"
  | "Advanced Mid"
  | "Advanced High"
  | "Superior"
  | "Distinguished";

export interface FluencyMetrics {
  articulationRate: number;
  mlu: number;
  silentPauseFreq: number;
  totalScore: number;
  cefrLevel: CEFRLevel;
  actflLevel: ACTFLLevel;
}

export function cefrToColor(cefr: CEFRLevel): string {
  const colorMap: Record<CEFRLevel, string> = {
    A1: "text-red-500",
    A2: "text-red-400",
    B1: "text-yellow-500",
    B2: "text-yellow-400",
    C1: "text-green-400",
    C2: "text-green-500",
  };
  return colorMap[cefr];
}

export function cefrToScore(cefr: CEFRLevel): number {
  const scoreMap: Record<CEFRLevel, number> = {
    A1: 25, A2: 40, B1: 55, B2: 70, C1: 85, C2: 98,
  };
  return scoreMap[cefr];
}
