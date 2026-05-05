import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Simulasi proses pengenalan suara (STT)
  // Di sini nantinya Tuan akan menembak ke server vLLM atau Whisper
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi loading

  return NextResponse.json({
    text: "快點！不要慢！", // Mock hasil suara user yang benar
    confidence: 0.95
  });
}