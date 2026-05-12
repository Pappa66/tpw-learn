export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  public async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.audioChunks = [];
    this.mediaRecorder.ondataavailable = (event) => { this.audioChunks.push(event.data); };
    this.mediaRecorder.start();
  }

  public stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
          const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
          resolve(blob);
        };
        this.mediaRecorder.stop();
      } else {
        resolve(new Blob());
      }
    });
  }
}
