import { NextResponse } from "next/server";
import { chatWithAI } from "@/lib/actions/chat";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await chatWithAI({
      persona: body.persona || "Shanti",
      userText: body.userText || "",
      targetText: body.targetText,
      recordingDurationMs: body.recordingDurationMs,
      userId: body.userId || 1, language: body.language,
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { message: "Sistem sibuk, coba lagi.", isExercise: false },
      { status: 200 }
    );
  }
}
