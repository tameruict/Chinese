"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabase, nextReview, dueDateFromDays, type VocabCard } from "@/lib/supabase";

type LocalState = { interval_days: number; due_date: string; lapses: number; last_result: string };

export default function Flashcards({ cards, lessonSlug }: { cards: VocabCard[]; lessonSlug: string }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [graded, setGraded] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const storageKey = useMemo(() => `srs:${lessonSlug}`, [lessonSlug]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setUserId(s?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const card = cards[idx];
  if (!card) return <p>Bài này chưa có thẻ từ vựng.</p>;

  async function grade(result: "remember" | "fuzzy" | "forget") {
    const sb = getSupabase();
    let currentInterval = 0;
    if (userId && sb) {
      const { data } = await sb.from("review_state").select("*").eq("user_id", userId).eq("card_id", card.id).maybeSingle();
      currentInterval = data?.interval_days ?? 0;
      const nr = nextReview(currentInterval, result);
      await sb.from("review_state").upsert({
        user_id: userId, card_id: card.id,
        interval_days: nr.interval_days, due_date: dueDateFromDays(nr.dueInDays),
        lapses: (data?.lapses ?? 0) + nr.lapsesInc, last_result: result, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,card_id" });
    } else {
      try {
        const raw = localStorage.getItem(storageKey);
        const all: Record<string, LocalState> = raw ? JSON.parse(raw) : {};
        const prev = all[card.id];
        currentInterval = prev?.interval_days ?? 0;
        const nr = nextReview(currentInterval, result);
        all[card.id] = { interval_days: nr.interval_days, due_date: dueDateFromDays(nr.dueInDays), lapses: (prev?.lapses ?? 0) + nr.lapsesInc, last_result: result };
        localStorage.setItem(storageKey, JSON.stringify(all));
      } catch { /* localStorage unavailable */ }
    }
    setGraded((g) => g + 1);
    setFlipped(false);
    setIdx((i) => (i + 1) % cards.length);
  }

  return (
    <div>
      <div className="card flashcard" onClick={() => setFlipped((f) => !f)}>
        {!flipped ? (<><p className="hanzi">{card.hanzi}</p><p className="progress">Chạm để lật thẻ</p></>) : (<>
          <p className="pinyin">{card.pinyin}</p>
          <p className="meaning">{card.meaning_vi}</p>
          {card.example && <p className="meaning">{card.example}</p>}
          {card.hsk_level ? <p className="progress">HSK {card.hsk_level}</p> : null}
        </>)}
      </div>
      <div className="row">
        <button className="good" onClick={() => grade("remember")}>Nhớ</button>
        <button className="mid" onClick={() => grade("fuzzy")}>Lơ mơ</button>
        <button className="bad" onClick={() => grade("forget")}>Quên</button>
      </div>
      <p className="progress">Thẻ {idx + 1}/{cards.length} · Đã chấm {graded} lượt · {userId ? "Đang lưu tiến độ vào tài khoản của bạn" : "Chế độ khách: tiến độ lưu tạm trên máy này — đăng nhập để đồng bộ"}</p>
      <div className="row">
        <button onClick={() => { setIdx((i) => (i - 1 + cards.length) % cards.length); setFlipped(false); }}>← Thẻ trước</button>
        <button onClick={() => { setIdx((i) => (i + 1) % cards.length); setFlipped(false); }}>Thẻ sau →</button>
      </div>
    </div>
  );
}
