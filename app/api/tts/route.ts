import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_KEY;

const VOICE_MAP: Record<string, string> = {
  Leeloo: "pNInz6obpgDQGcFmaJgB",
  Shanti: "XrExE9yKIg1WjnnlVkGX",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");
  const mode = searchParams.get("mode") || "Shanti";

  if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });
  if (!ELEVENLABS_API_KEY) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  const voiceId = VOICE_MAP[mode] || VOICE_MAP.Shanti;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=0`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: mode === "Leeloo" ? 0.35 : 0.5,
            similarity_boost: 0.75,
            style: mode === "Leeloo" ? 0.7 : 0.3,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `ElevenLabs: ${err}` }, { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (e) {
    return NextResponse.json({ error: "TTS Failed" }, { status: 500 });
  }
}
