// app/api/evaluate/route.ts

import { NextResponse } from 'next/server';
import { Evaluator } from '@/lib/Evaluator';

export async function POST(req: Request) {
  try {
    // Kita tambahkan 'mode' untuk diambil dari request body
    const { targetText, userText, mode } = await req.json();

    // Default ke 'Leeloo' jika mode tidak terkirim
    const selectedMode = mode || 'Leeloo';

    // 1. Hitung skor kemiripan teks
    const score = Evaluator.calculateScore(targetText, userText);
    
    // 2. Sekarang getAssessment butuh 2 argumen: score dan mode
    const assessment = Evaluator.getAssessment(score, selectedMode);

    return NextResponse.json({
      score,
      status: assessment.status,
      color: assessment.color,
      feedback: assessment.feedback // Mengambil pesan cerdas dari AI
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses evaluasi" }, { status: 500 });
  }
}