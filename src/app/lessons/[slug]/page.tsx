import { notFound } from "next/navigation";
import { getSupabase, type Lesson, type VocabCard } from "@/lib/supabase";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = getSupabase();
  if (!sb) return <p className="err">Chưa cấu hình Supabase.</p>;
  const { data: lesson } = await sb.from("lessons").select("*").eq("slug", slug).maybeSingle();
  if (!lesson) notFound();
  const l = lesson as Lesson;
  const { data: cards } = await sb.from("vocab_cards").select("*").eq("lesson_slug", slug).order("created_at");
  const content = l.content ?? {};
  const sections = content.sections ?? [];

  return (
    <div>
      <div className="breadcrumb"><a href="/">← Tất cả bài học</a></div>

      <section className="lesson-hero">
        <span className="hero-eyebrow">Quyển {l.book} • Bài {l.lesson_no}</span>
        <h1>{l.title}</h1>
        <p className="meta" style={{ maxWidth: 620 }}>{content.intro ?? "Bài học gồm nội dung chắt lọc, audio phát âm, flashcard và luyện tập trắc nghiệm."}</p>
        <div className="chips" style={{ marginTop: 16 }}>
          <span className="chip">🎧 {content.audio?.length ?? 0} audio</span>
          <span className="chip">🃏 {(cards ?? []).length} flashcard</span>
          <span className="chip jade">✓ {content.quizzes?.length ?? 0} câu luyện tập</span>
        </div>
      </section>

      {sections.length > 0 && (
        <nav className="toc" aria-label="Mục lục bài học">
          {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
          {!!content.audio?.length && <a href="#audio">🎧 Audio</a>}
          <a href="#flashcards">🃏 Flashcard</a>
          <a href="#quiz">✎ Luyện tập</a>
        </nav>
      )}

      {sections.map((s, idx) => (
        <section key={s.id} id={s.id} style={{ scrollMarginTop: 90 }}>
          <div className="section-head" style={{ marginTop: 26 }}>
            <div><h2><span style={{ color: "#E23A2E", marginRight: 8 }}>{String(idx + 1).padStart(2, "0")}</span>{s.title}</h2></div>
          </div>
          <div className="content-card">{s.body.map((line, i) => <p key={i}>{line}</p>)}</div>
        </section>
      ))}

      {!!content.audio?.length && (
        <section id="audio" style={{ scrollMarginTop: 90 }}>
          <div className="section-head"><div><h2>Audio của bài</h2><p>Nghe và đọc theo — đặc biệt quan trọng ở bài phát âm.</p></div></div>
          {content.audio.map((a) => (
            <div className="audio-row" key={a.src}>
              <div className="audio-icon">▶</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{a.title}</strong> <span className="meta">• {a.duration}</span>
                <audio controls preload="none" src={a.src} />
              </div>
            </div>
          ))}
        </section>
      )}

      <section id="flashcards" style={{ scrollMarginTop: 90 }}>
        <div className="section-head"><div><h2>Flashcard từ vựng</h2><p>{(cards ?? []).length} thẻ — chạm vào thẻ để lật, rồi tự chấm mức nhớ.</p></div></div>
        <Flashcards cards={(cards ?? []) as VocabCard[]} lessonSlug={slug} />
      </section>

      <section id="quiz" style={{ scrollMarginTop: 90 }}>
        <div className="section-head"><div><h2>Luyện tập trắc nghiệm</h2><p>Làm xong mỗi câu sẽ có giải thích ngay.</p></div></div>
        <Quiz quizzes={content.quizzes ?? []} />
      </section>
    </div>
  );
}
