"use client";
import { useEffect, useState } from "react";
import type { LessonContent, VocabCard } from "@/lib/supabase";
import Lecture from "./Lecture";
import Homework from "./Homework";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";

type Section = NonNullable<LessonContent["sections"]>[number];
type Audio = NonNullable<LessonContent["audio"]>[number];

type Props = {
  lessonSlug: string;
  lectureSections: Section[];
  homeworkLines: string[];
  lectureAudio: Audio[];
  homeworkAudio: Audio[];
  cards: VocabCard[];
  quizzes: NonNullable<LessonContent["quizzes"]>;
};

type TabId = "lecture" | "practice" | "homework";

export default function LessonTabs(p: Props) {
  const [tab, setTab] = useState<TabId>("lecture");

  // Mở đúng tab khi vào từ link cũ kiểu #flashcards / #quiz / #btvn
  useEffect(() => {
    const h = window.location.hash;
    if (h === "#flashcards" || h === "#quiz" || h === "#luyen-tap") setTab("practice");
    else if (h === "#btvn" || h === "#bai-tap-ve-nha") setTab("homework");
  }, []);

  const tabs: { id: TabId; icon: string; label: string; sub: string }[] = [
    { id: "lecture", icon: "📖", label: "Bài giảng", sub: `${p.lectureSections.length} mục • ${p.lectureAudio.length} audio` },
    { id: "practice", icon: "✎", label: "Luyện tập", sub: `${p.cards.length} flashcard • ${p.quizzes.length} câu` },
    { id: "homework", icon: "🏠", label: "Bài tập về nhà", sub: `${p.homeworkLines.length} việc • ${p.homeworkAudio.length} audio` },
  ];

  return (
    <div>
      <div className="lesson-tabs" role="tablist" aria-label="Phần của bài học">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`lesson-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="lesson-tab-icon">{t.icon}</span>
            <span className="lesson-tab-text">
              <b>{t.label}</b>
              <small>{t.sub}</small>
            </span>
          </button>
        ))}
      </div>

      {tab === "lecture" && (
        <div role="tabpanel">
          <Lecture sections={p.lectureSections} audio={p.lectureAudio} />
        </div>
      )}

      {tab === "practice" && (
        <div role="tabpanel">
          <section id="flashcards">
            <div className="section-head" style={{ marginTop: 8 }}>
              <div>
                <h2>Flashcard từ vựng</h2>
                <p>{p.cards.length} thẻ — chạm vào thẻ để lật, rồi tự chấm mức nhớ.</p>
              </div>
            </div>
            <Flashcards cards={p.cards} lessonSlug={p.lessonSlug} />
          </section>

          <section id="quiz">
            <div className="section-head">
              <div>
                <h2>Trắc nghiệm</h2>
                <p>Làm xong mỗi câu sẽ có giải thích ngay.</p>
              </div>
            </div>
            <Quiz quizzes={p.quizzes} />
          </section>
        </div>
      )}

      {tab === "homework" && (
        <div role="tabpanel">
          <Homework lines={p.homeworkLines} audio={p.homeworkAudio} lessonSlug={p.lessonSlug} />
        </div>
      )}
    </div>
  );
}
