import { getSupabase, type Lesson } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const COVER_HANZI = ["你好", "谢谢", "中文", "学习", "朋友", "老师"];

export default async function Home() {
  const sb = getSupabase();
  let lessons: Lesson[] = [];
  let error: string | null = null;
  if (!sb) error = "Chưa cấu hình Supabase (thiếu biến môi trường).";
  else {
    const { data, error: err } = await sb.from("lessons").select("*").order("book").order("lesson_no");
    if (err) error = err.message; else lessons = (data ?? []) as Lesson[];
  }
  const totalAudio = lessons.reduce((s, l) => s + (l.content?.audio?.length ?? 0), 0);
  const totalQuiz = lessons.reduce((s, l) => s + (l.content?.quizzes?.length ?? 0), 0);
  const first = lessons[0];

  return (
    <div>
      <section className="hero">
        <span className="hero-eyebrow">✦ Lộ trình đọc hiểu • Quyển 1</span>
        <h1>Học tiếng Trung,<br />từng bài một cách<br />vững chắc.</h1>
        <p>Mỗi bài học đều có nội dung chắt lọc, audio phát âm chuẩn, flashcard ghi nhớ theo SRS và bài luyện tập — học xong là nhớ, nhớ rồi là đọc được.</p>
        <div className="hero-actions">
          {first ? <a className="btn btn-white" href={`/lessons/${first.slug}`}>▶ Tiếp tục học {first.title?.split(":")[0] ?? "Bài 1"}</a> : <a className="btn btn-white" href="#lessons">Bắt đầu học →</a>}
          <a className="btn btn-ghost" href="#lessons">Xem tất cả bài học</a>
        </div>
        <div className="hero-stats">
          <div className="stat-pill"><b>{lessons.length || 15}</b><span>Bài học</span></div>
          <div className="stat-pill"><b>{totalAudio || 10}</b><span>Track audio</span></div>
          <div className="stat-pill"><b>{totalQuiz || 10}</b><span>Câu luyện tập</span></div>
          <div className="stat-pill"><b>25+</b><span>Thẻ từ vựng / bài</span></div>
        </div>
      </section>

      <div className="section-head" id="lessons">
        <div>
          <h2>Bài học của bạn</h2>
          <p>Chọn một bài để học — tiến độ ôn tập được lưu khi bạn đăng nhập.</p>
        </div>
        <span className="chip jade">● Đồng bộ Supabase</span>
      </div>

      {error && <div className="card"><p className="err">Không tải được danh sách bài học: {error}</p></div>}

      <div className="lesson-grid">
        {lessons.map((l, i) => (
          <a key={l.id} className="lesson-card" href={`/lessons/${l.slug}`}>
            <div className="lesson-cover">
              <span className="big-hanzi">{COVER_HANZI[i % COVER_HANZI.length]}</span>
              <span className="book-badge">QUYỂN {l.book} • BÀI {l.lesson_no}</span>
            </div>
            <div className="lesson-body">
              <h3>{l.title}</h3>
              <div className="meta">{l.content?.intro ? l.content.intro.slice(0, 110) + (l.content.intro.length > 110 ? "…" : "") : "Bài học gồm nội dung, audio, flashcard và luyện tập."}</div>
              <div className="chips">
                <span className="chip">🎧 {l.content?.audio?.length ?? 0} audio</span>
                <span className="chip">🃏 Flashcard</span>
                <span className="chip jade">✓ {l.content?.quizzes?.length ?? 0} câu quiz</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: i === 0 ? "18%" : "4%" }} /></div>
              <div className="meta" style={{ marginTop: 8, fontWeight: 700, color: "#C2410C" }}>Học bài này →</div>
            </div>
          </a>
        ))}
      </div>
      {lessons.length === 0 && !error && <div className="card"><p>Chưa có bài học nào.</p></div>}

      <div className="card" style={{ marginTop: 22, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <strong style={{ fontSize: 17 }}>Học kiểu flashcard, nhớ lâu như Anki</strong>
          <div className="meta" style={{ marginTop: 4 }}>Chấm Nhớ / Lơ mơ / Quên — hệ thống tự xếp lịch ôn theo SRS (1 • 3 • 7 • 14 • 30 ngày).</div>
        </div>
        <a className="btn btn-primary" href={first ? `/lessons/${first.slug}#flashcards` : "/login"}>Ôn từ vựng ngay</a>
      </div>
    </div>
  );
}
