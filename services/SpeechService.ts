export class SpeechService {
  /**
   * Mengubah teks menjadi suara (TTS) menggunakan Browser API
   */
  public static speak(text: string, mode: 'Leeloo' | 'Shanti' = 'Leeloo'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // Bahasa Mandarin
      utterance.rate = mode === 'Leeloo' ? 1.2 : 0.8; // Leeloo lebih tegas/cepat
      utterance.pitch = mode === 'Leeloo' ? 0.8 : 1.1; // Leeloo suara lebih rendah/berat
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Mengubah suara menjadi teks (STT) menggunakan Browser API
   */
  public static startListening(onResult: (text: string) => void): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
      };
      recognition.start();
    } else {
      alert("Browser Tuan tidak mendukung Speech Recognition.");
    }
  }
}