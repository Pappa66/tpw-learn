import { NextResponse } from "next/server";
import { analyzeFluency } from "@/lib/actions/fluency";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userText, targetText, mode, recordingDurationMs } = await req.json();

    const fluency = await analyzeFluency({
      userText,
      targetText,
      recordingDurationMs: recordingDurationMs || 3000,
      userId: 1,
    });

    const OLLAMA_URL = process.env.VLLM_URL || "http://llm:11434";

    const prompt = `
      Identitas: Kamu adalah ${mode || "Shanti"}.
      User bicara: "${userText}" target: "${targetText}".
      Level: ${fluency.cefrLevel}, Skor: ${fluency.totalScore}/100.
      Beri feedback dlm bhs Indonesia (maks 20 kata).
      ${mode === "Leeloo" ? "Galak, sinis." : "Lembut, memotivasi."}
    `;

    let feedback = `Skor: ${fluency.totalScore}, Level: ${fluency.cefrLevel}`;
    try {
      const resAI = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3", prompt, stream: false }),
      });
      const aiData = await resAI.json();
      if (aiData.response) feedback = aiData.response;
    } catch {}

    const user = db.prepare("SELECT id FROM User LIMIT 1").get() as any;
    if (user) {
      db.prepare(
        `INSERT INTO History (userId, mode, target, userText, score, feedback)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(user.id, mode || "Shanti", targetText, userText, fluency.totalScore, feedback);
    }

    return NextResponse.json({
      score: fluency.totalScore,
      fluency,
      feedback,
      status: fluency.totalScore >= 55 ? "READY" : "RISK",
    });
  } catch (e) {
    return NextResponse.json({ error: "Sistem sibuk" }, { status: 500 });
  }
}
