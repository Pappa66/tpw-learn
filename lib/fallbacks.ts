const SCENARIOS: Record<string, any[]> = {
  mandarin: [
    { target: '你好', pinyin: 'Nǐ hǎo', indonesian: 'Halo' },
    { target: '謝謝', pinyin: 'Xièxiè', indonesian: 'Terima kasih' },
    { target: '對不起', pinyin: 'Duìbuqǐ', indonesian: 'Maaf' },
  ],
  jepang: [
    { target: 'こんにちは', pinyin: 'Konnichiwa', indonesian: 'Halo' },
    { target: 'ありがとう', pinyin: 'Arigatou', indonesian: 'Terima kasih' },
    { target: 'すみません', pinyin: 'Sumimasen', indonesian: 'Permisi' },
  ],
};

export function getFallback(lang?: string): any[] {
  if (lang?.includes('jepang')) return SCENARIOS.jepang;
  return SCENARIOS.mandarin;
}

export function getDefaultChat(persona: string, lang?: string): { message: string; target: string } {
  if (lang?.includes('jepang')) {
    return {
      message: persona === 'Leeloo' ? 'Ucapkan: こんにちは! CEPAT!' : 'Coba ucapkan: こんにちは (Konnichiwa) - Halo',
      target: 'こんにちは',
    };
  }
  return {
    message: persona === 'Leeloo' ? 'Ucapkan: 你好! Cepat!' : 'Coba ucapkan: 你好 (Nǐ hǎo) - Halo',
    target: '你好',
  };
}
