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
  return (
    <div>
      <p className="meta"><a href="/">← Tất cả bài học</a></p>
      <h1>{l.title}</h1>
      <p className="meta">Quyển {l.book} · Bài {l.lesson_no}</p>
      {content.intro && <div className="card"><p>{content.intro}</p></div>}
      {(content.sections ?? []).map((s) => (
        <section key={s.id}>
          <h2>{s.title}</h2>
          <div className="card">{s.body.map((line, i) => <p key={i}>{line}</p>)}</div>
        </section>
      ))}
      {!!content.audio?.length && (<>
        <h2>Audio của bài</h2>
        {content.audio.map((a) => (
          <div className="card" key={a.src}>
            <strong>{a.title}</strong> <span className="meta">· {a.duration}</span>
            <audio controls preload="none" src={a.src} />
          </div>
        ))}
      </>)}
      <h2>Flashcard từ vựng ({(cards ?? []).length} thẻ)</h2>
      <Flashcards cards={(cards ?? []) as VocabCard[]} lessonSlug={slug} />
      <h2>Luyện tập trắc nghiệm</h2>
      <Quiz quizzes={content.quizzes ?? []} />
    </div>
  );
}
