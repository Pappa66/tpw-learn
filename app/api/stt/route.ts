import { NextResponse } from "next/server";

const STT_URL = process.env.STT_URL || "http://stt:9000";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const lang = (formData.get("language") as string) || "";

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ text: "", error: "No audio" }, { status: 400 });
    }

    const whisperForm = new FormData();
    whisperForm.append("audio_file", audioFile, "recording.wav");

    const params = new URLSearchParams({ encode: "true", task: "transcribe", output: "json" });
    if (lang) params.set("language", lang);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(STT_URL + "/asr?" + params.toString(), {
        method: "POST", body: whisperForm, signal: controller.signal,
      });
      if (!res.ok) return NextResponse.json({ text: "" });
      const data = await res.json();
      return NextResponse.json({ text: data.text || "" });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return NextResponse.json({ text: "" });
  }
}
