// lib/Evaluator.ts

export type AssessmentStatus = 'READY' | 'DEVELOPING' | 'RISK';

export interface AssessmentResult {
  status: AssessmentStatus;
  color: string;
  feedback: string;
}

export class Evaluator {
  private static readonly MAX_LEVEL = 30;

  public static calculateScore(target: string, input: string): number {
    if (!input) return 0;
    const t = target.toLowerCase().trim();
    const i = input.toLowerCase().trim();
    if (t === i) return 100;
    
    const targetWords = t.split(' ');
    const inputWords = i.split(' ');
    const matches = targetWords.filter(word => inputWords.includes(word)).length;
    return Math.round((matches / targetWords.length) * 100);
  }

  /**
   * Menghasilkan feedback interaktif berdasarkan skor dan mode AI
   */
  public static getAssessment(score: number, mode: 'Leeloo' | 'Shanti'): AssessmentResult {
    if (score >= 80) {
      return { 
        status: 'READY', 
        color: 'text-green-500',
        feedback: mode === 'Leeloo' 
          ? "Bagus. Jangan cepat puas, pertahankan kecepatan ini!" 
          : "Luar biasa! Pengucapanmu sangat jernih dan mudah dimengerti."
      };
    }
    if (score >= 50) {
      return { 
        status: 'DEVELOPING', 
        color: 'text-yellow-500',
        feedback: mode === 'Leeloo'
          ? "Masih terlalu lambat! Fokus pada kata kunci di depan."
          : "Sudah cukup baik, sedikit polesan lagi pada intonasi ya."
      };
    }
    return { 
      status: 'RISK', 
      color: 'text-red-500',
      feedback: mode === 'Leeloo'
        ? "Payah! Ulangi lagi, instruksi tidak sampai ke telinga rekan kerja!"
        : "Jangan menyerah, coba dengarkan instruksi AI sekali lagi pelan-pelan."
    };
  }

  public static getProgressPercentage(currentLevel: number): number {
    return (currentLevel / this.MAX_LEVEL) * 100;
  }
}