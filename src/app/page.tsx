import { getSupabase, type Lesson } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sb = getSupabase();
  let lessons: Lesson[] = [];
  let error: string | null = null;
  if (!sb) error = "Chưa cấu hình Supabase (thiếu biến môi trường).";
  else {
    const { data, error: err } = await sb.from("lessons").select("*").order("book").order("lesson_no");
    if (err) error = err.message; else lessons = (data ?? []) as Lesson[];
  }
  return (
    <div>
      <h1>Bài học tiếng Trung</h1>
      <p className="meta">Mỗi bài gồm: nội dung bài học · audio phát âm · flashcard từ vựng · luyện tập trắc nghiệm. Tiến độ ôn tập được lưu khi bạn đăng nhập.</p>
      {error && <p className="err">Không tải được danh sách bài học: {error}</p>}
      {lessons.map((l) => (
        <a key={l.id} className="card lesson-card" href={`/lessons/${l.slug}`}>
          <h3>{l.title}</h3>
          <div className="meta">Quyển {l.book} · Bài {l.lesson_no} · {l.content?.audio?.length ?? 0} track audio · {l.content?.quizzes?.length ?? 0} câu luyện tập</div>
        </a>
      ))}
      {lessons.length === 0 && !error && <p>Chưa có bài học nào.</p>}
    </div>
  );
}
