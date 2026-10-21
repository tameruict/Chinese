import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}

export type ExItem = { hanzi?: string; pinyin: string; meaning?: string };

export type LessonBlock =
  | { type: "lead"; text: string }
  | { type: "callout"; text: string; warn?: boolean }
  | { type: "subhead"; text: string }
  | { type: "phonetics"; items: { symbol: string; guide: string; examples?: ExItem[] }[] }
  | { type: "examples"; title?: string; items: ExItem[] }
  | { type: "grid"; title?: string; items: string[] }
  | { type: "tones"; items: { name: string; mark: string; pitch: string; desc: string; examples?: ExItem[] }[] }
  | { type: "concepts"; items: { title: string; hanzi?: string; pinyin?: string; desc: string; example?: string }[] }
  | { type: "strokes"; groups: { label: string; items: { name: string; glyph?: string; desc?: string }[] }[] }
  | { type: "rules"; items: { text: string; hanzi?: string; example?: string }[] };

export type LessonSection = {
  id: string;
  title: string;
  body: string[];
  blocks?: LessonBlock[];
};

export type LessonContent = {
  intro?: string;
  sections?: LessonSection[];
  audio?: { src: string; title: string; slide: string; duration: string }[];
  quizzes?: Quiz[];
};

export type Quiz = {
  type: "split" | "build";
  question: string;
  options: string[];
  answer: number;
  explain?: string;
};

export type Lesson = {
  id: string;
  slug: string;
  book: number;
  lesson_no: number;
  title: string;
  content: LessonContent;
};

export type VocabCard = {
  id: string;
  lesson_slug: string;
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  example: string | null;
  hsk_level: number | null;
  tags: string[];
};

export const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function nextReview(currentInterval: number, result: "remember" | "fuzzy" | "forget") {
  const idx = SRS_INTERVALS.indexOf(currentInterval);
  if (result === "forget") return { interval_days: 1, dueInDays: 1, lapsesInc: 1 };
  if (result === "fuzzy") return { interval_days: Math.max(1, currentInterval || 1), dueInDays: 1, lapsesInc: 0 };
  const nextIdx = Math.min(SRS_INTERVALS.length - 1, (idx < 0 ? 0 : idx + 1));
  const days = SRS_INTERVALS[nextIdx];
  return { interval_days: days, dueInDays: days, lapsesInc: 0 };
}

export function dueDateFromDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
