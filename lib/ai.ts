import db from "@/lib/db";

const OLLAMA_URL = process.env.VLLM_URL || "http://llm:11434";
const KEYS = [
  process.env.GEMINI_API_KEY || "",
  process.env.GEMINI_KEY2 || "",
  process.env.GEMINI_KEY3 || "",
].filter(Boolean);
const TIMEOUT_MS = 10000;

let keyIndex = 0;

function checkCache(prompt: string): string | null {
  const row = db.prepare("SELECT response FROM AICache WHERE promptHash = ? ORDER BY createdAt DESC LIMIT 1").get(prompt.substring(0, 200)) as any;
  return row?.response || null;
}

function saveCache(prompt: string, response: string) {
  try {
    db.prepare("INSERT OR REPLACE INTO AICache (promptHash, response) VALUES (?, ?)").run(prompt.substring(0, 200), response);
  } catch {}
}

async function callGemini(prompt: string): Promise<string> {
  for (let i = 0; i < KEYS.length; i++) {
    const key = KEYS[(keyIndex + i) % KEYS.length];
    if (!key) continue;
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), TIMEOUT_MS);
      const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=" + key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 60, temperature: 0.5 } }),
        signal: c.signal,
      });
      clearTimeout(t);
      if (res.status === 429 || res.status === 403) {
        keyIndex = (keyIndex + i + 1) % KEYS.length;
        continue;
      }
      if (!res.ok) continue;
      const d = await res.json();
      const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) return text;
    } catch { continue; }
  }
  return "";
}

async function callOllama(prompt: string): Promise<string> {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 30000);
    const res = await fetch(OLLAMA_URL + "/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tinyllama", prompt, stream: false, options: { num_predict: 50, temperature: 0.5 } }),
      signal: c.signal,
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const d = await res.json();
    return d.response || "";
  } catch { return ""; }
}

export async function generateContent(prompt: string): Promise<string> {
  const cached = checkCache(prompt);
  if (cached) return cached;

  const result = await callGemini(prompt);
  if (result) { saveCache(prompt, result); return result; }

  const ollama = await callOllama(prompt);
  if (ollama) { saveCache(prompt, ollama); return ollama; }

  return "";
}
