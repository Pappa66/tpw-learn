import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateContent } from '@/lib/ai';
import { getFallback } from '@/lib/fallbacks';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || 'komunikasi kerja';
  const lang = searchParams.get('lang') || 'mandarin';
  const cacheKey = topic + '::' + lang;

  const cached = db.prepare('SELECT response FROM ScenarioCache WHERE topic = ? ORDER BY createdAt DESC LIMIT 1').get(cacheKey) as { response: string } | undefined;
  if (cached) return NextResponse.json(JSON.parse(cached.response));

  const fallback = getFallback(lang);
  const langName = lang.includes('jepang') ? 'Bahasa Jepang' : 'Bahasa Mandarin';

  generateContent('Buat 3 kalimat ' + langName + ' topik "' + topic + '". JSON: [{"target":"","pinyin":"","indonesian":""}]').then((text) => {
    try {
      const s = text.indexOf('['), e = text.lastIndexOf(']') + 1;
      if (s !== -1 && e > s) {
        const p = JSON.parse(text.substring(s, e));
        if (Array.isArray(p) && p.length > 0) {
          db.prepare('DELETE FROM ScenarioCache WHERE topic = ?').run(cacheKey);
          db.prepare('INSERT INTO ScenarioCache (topic, response) VALUES (?, ?)').run(cacheKey, JSON.stringify(p));
        }
      }
    } catch (e) {}
  }).catch(() => {});

  db.prepare('DELETE FROM ScenarioCache WHERE topic = ?').run(cacheKey);
  db.prepare('INSERT INTO ScenarioCache (topic, response) VALUES (?, ?)').run(cacheKey, JSON.stringify(fallback));

  return NextResponse.json(fallback);
}
