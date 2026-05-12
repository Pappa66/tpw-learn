# TPW-LEARN — AI Language Learning Assistant

Aplikasi belajar bahasa berbasis AI dengan dual tutor persona (Leeloo/Shanti), fluency engine, speech recognition, dan text-to-speech.

## Arsitektur

```
┌─────────────┐    ┌──────────────┐    ┌───────────┐
│  Next.js 16 │───▶│   Ollama     │◀──▶│  Llama3   │
│  (App Router)│   │  (tinyllama) │    │  (7B CPU)  │
│             │    │              │    └───────────┘
│  ChatPanel  │    │  ┌──────────┐│
│  Fluency    │    │  │  Gemini  ││◀── API (3 keys)
│  Engine     │    │  │(primary) ││
│             │    │  └──────────┘│
│  Prisma 7   │    │  ┌──────────┐│
│  + SQLite   │    │  │ Whisper  ││── STT
│             │    │  └──────────┘│
│             │    │  ┌──────────┐│
│             │    │  │ElevenLabs││── TTS
│             │    │  └──────────┘│
└─────────────┘    └──────────────┘
```

## Prasyarat

- **Docker** + Docker Compose
- **Node.js 22** (untuk development di luar Docker)
- **ElevenLabs API key** (TTS)
- **Google Gemini API key(s)** (AI) — opsional, fallback ke TinyLlama lokal

## Setup Cepat (5 menit)

### 1. Clone & masuk

```bash
git clone https://github.com/Pappa66/tpw-learn.git
cd tpw-learn
```

### 2. Konfigurasi environment

```bash
cp .env.local.example .env.local
# Isi API key:
#   ELEVENLABS_KEY=sk_xxx           (wajib)
#   GEMINI_API_KEY=AIza...          (opsional, 3 key auto-rotate)
#   GEMINI_KEY2=AIza...
#   GEMINI_KEY3=AIza...
```

### 3. Jalankan

```bash
docker compose up -d
```

Tunggu ~2 menit. Buka **http://localhost:80**

### 4. Setup Ollama (pertama kali)

```bash
# Pull model AI lokal (hanya sekali)
docker exec tpw_llm ollama pull tinyllama
```

> **Catatan:** `tinyllama` (637MB) jauh lebih cepat dari `llama3` (4.7GB). 
> Kalau mau kualitas lebih baik: `docker exec tpw_llm ollama pull llama3`
> Tapi respon jadi lambat (CPU-only, ~30-60 detik per request).

## Struktur Proyek

```
tpw-learn/
├── app/
│   ├── api/
│   │   ├── chat/         # AI Chat API (Gemini → TinyLlama)
│   │   ├── evaluate/     # Evaluasi fluency + Ollama feedback
│   │   ├── scenario/     # Generate materi belajar
│   │   ├── stt/          # Speech-to-Text (Whisper)
│   │   └── tts/          # Text-to-Speech (ElevenLabs)
│   ├── exercise/         # Halaman latihan
│   ├── belajar/          # Pilih program & skenario
│   └── layout.tsx        # Layout utama + FloatingChat
├── components/
│   ├── ChatPanel.tsx     # Chat utama (floating + embedded)
│   ├── Avatar.tsx        # SVG avatar Leeloo/Shanti
│   ├── FloatingChat.tsx  # Wrapper chat global
│   └── BottomNav.tsx     # Navigasi bawah
├── lib/
│   ├── actions/
│   │   ├── chat.ts       # Server Action: AI chat logic
│   │   └── fluency.ts    # Server Action: fluency metrics
│   ├── ai.ts             # AI provider (Gemini + Ollama)
│   ├── db.ts             # Database (better-sqlite3 + WAL)
│   ├── fallbacks.ts      # Default responses per bahasa
│   ├── helpers/
│   │   └── syllable-counter.ts  # Hitung suku kata (CJK + EN)
│   └── types.ts          # Shared types
├── services/
│   ├── AudioRecorderService.ts  # Rekam suara + mic release
│   └── SpeechService.ts         # Play audio
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migrations
├── docker-compose.yml    # App + Ollama + Whisper
└── .env.local            # API keys (jangan di-commit!)
```

## API Keys

| Service | Wajib? | Fungsi | Dapat di |
|---------|--------|--------|----------|
| **ElevenLabs** | ✅ Wajib | TTS suara Leeloo/Shanti | https://elevenlabs.io |
| **Gemini** | ❌ Opsional | AI generasi materi (lebih pintar) | https://aistudio.google.com |
| **Ollama** | ❌ Bawaan | AI fallback lokal (tinyllama) | Bawaan Docker |

Tanpa Gemini, AI tetap jalan pake TinyLlama lokal (respons lebih sederhana).

## Mode Tutor

| Mode | Karakter | Suara (ElevenLabs) | Gaya |
|------|----------|-------------------|------|
| **Leeloo** | Tegas, galak | `Adam - Dominant, Firm` | "SALAH! FOKUS!" |
| **Shanti** | Lembut, sabar | `Matilda - Professional` | "Bagus, coba lagi ya" |

Ganti mode kapan saja dengan klik avatar di ChatPanel.

## Database

SQLite dengan WAL mode (support concurrent reads/writes).

```bash
# Akses langsung
docker exec -it tpw_app sqlite3 /app/tpw.sqlite
```

### Tabel utama
- `User` — Data peserta
- `Assessment` — Skor fluency historis (MLU, articulation rate, CEFR)
- `History` — Riwayat percakapan
- `Skill` — Hard/soft skills
- `Milestone` — Pencapaian

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **Gemini quota habis** | Ganti key di `.env.local` atau tunggu 1 menit (free tier reset) |
| **Ollama lambat** | Pull model lebih kecil: `docker exec tpw_llm ollama pull tinyllama` |
| **STT error 502** | Whisper container butuh waktu startup. Coba lagi. |
| **Suara ElevenLabs error** | Cek `ELEVENLABS_KEY` di `.env.local` |
| **Database error** | Hapus `tpw.sqlite` lalu restart: `docker compose down && docker compose up -d` |

## Development

```bash
# Tanpa Docker
npm install
cp .env.local.example .env.local
npx prisma generate
npx next dev -H 0.0.0.0
```

> **Catatan:** `node_modules` di dalam container terinstall sebagai root.
> Untuk development di host, hapus dulu: `sudo rm -rf node_modules && npm install`
