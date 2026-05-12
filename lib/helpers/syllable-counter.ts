export function countSyllables(text: string): number {
  if (!text) return 0;
  const t = text.trim();
  const cjk = t.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff]/g);
  if (cjk && cjk.length > t.length * 0.3) return cjk.length;
  const eng = t.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  if (!eng) return 0;
  const words = eng.split(/\s+/).filter(Boolean);
  let n = 0;
  for (const w of words) {
    const s = w.replace(/e$/, "");
    let c = 0, p = false;
    for (const ch of s) {
      const v = "aeiouy".includes(ch);
      if (v && !p) c++;
      p = v;
    }
    n += c || 1;
  }
  return n;
}

export function countUtterances(text: string): number {
  if (!text.trim()) return 0;
  const s = text.split(/[。！？.!?\n、]+/).filter(Boolean);
  return s.length || 1;
}

export function estimateSilentPauses(text: string, dur: number): number {
  if (dur <= 0 || !text.trim()) return 0;
  const sec = dur / 1000;
  const n = text.split(/[\s。，,]+/).filter(Boolean).length;
  const exp = n * 0.3;
  if (sec <= exp) return 0;
  return Math.round((sec - exp) / 0.5);
}
