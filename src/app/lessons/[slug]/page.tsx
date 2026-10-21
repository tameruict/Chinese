import { notFound } from "next/navigation";
import { getSupabase, type Lesson, type VocabCard } from "@/lib/supabase";
import LessonTabs from "@/components/LessonTabs";

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
  const allAudio = content.audio ?? [];

  // Tách BTVN ra khỏi bài giảng: mục nào là bài tập về nhà thì sang tab riêng
  const isHomework = (s: (typeof sections)[number]) =>
    s.id === "btvn" || /bài tập về nhà/i.test(s.title);
  const homeworkSection = sections.find(isHomework);
  const lectureSections = sections.filter((s) => !isHomework(s));
  const homeworkLines = homeworkSection?.body ?? [];

  // Tách audio: track BTVN (slide >= 31 hoặc tiêu đề có "BTVN") sang tab BTVN
  const isHwAudio = (a: (typeof allAudio)[number]) => {
    const slide = parseInt(String(a.slide).split("-")[0], 10);
    return slide >= 31 || /btvn/i.test(a.title);
  };
  const homeworkAudio = allAudio.filter(isHwAudio);
  const lectureAudio = allAudio.filter((a) => !isHwAudio(a));

  return (
    <div>
      <div className="breadcrumb"><a href="/">← Tất cả bài học</a></div>

      <section className="lesson-hero slim">
        <span className="hero-eyebrow">Quyển {l.book} • Bài {l.lesson_no}</span>
        <h1>{l.title}</h1>
        <p className="meta" style={{ maxWidth: 620 }}>{content.intro ?? "Bài học gồm nội dung chắt lọc, audio phát âm, flashcard và luyện tập trắc nghiệm."}</p>
        <div className="chips" style={{ marginTop: 14 }}>
          <span className="chip">📖 {lectureSections.length} mục bài giảng</span>
          <span className="chip">🎧 {allAudio.length} audio</span>
          <span className="chip">🃏 {(cards ?? []).length} flashcard</span>
          <span className="chip jade">🏠 {homeworkLines.length} việc về nhà</span>
        </div>
      </section>

      <LessonTabs
        lessonSlug={slug}
        lectureSections={lectureSections}
        homeworkLines={homeworkLines}
        lectureAudio={lectureAudio}
        homeworkAudio={homeworkAudio}
        cards={(cards ?? []) as VocabCard[]}
        quizzes={content.quizzes ?? []}
      />
    </div>
  );
}
