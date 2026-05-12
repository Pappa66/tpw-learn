export const SpeechService = {
  speak: async (text: string, mode: 'Leeloo' | 'Shanti') => {
    // Kita panggil API internal kita yang nembak ke suara Neural
    const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}&mode=${mode}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  }
};