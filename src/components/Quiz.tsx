"use client";
import { useState } from "react";
import type { Quiz as QuizType } from "@/lib/supabase";

export default function Quiz({ quizzes }: { quizzes: QuizType[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  if (!quizzes?.length) return <div className="card"><p>Bài này chưa có câu luyện tập.</p></div>;
  const done = Object.keys(picked).length;
  const score = quizzes.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((done / quizzes.length) * 100);

  return (
    <div>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div><strong style={{ fontSize: 17 }}>Tiến độ: {done}/{quizzes.length} câu</strong><div className="meta">Điểm hiện tại: {score}/{quizzes.length}</div></div>
        <div style={{ flex: "1 1 220px", maxWidth: 340 }}><div className="progress-bar" style={{ margin: 0, maxWidth: "none" }}><i style={{ width: `${pct}%` }} /></div></div>
        {done === quizzes.length && <span className="chip jade" style={{ fontSize: 14, padding: "8px 14px" }}>{score === quizzes.length ? "🏆 Hoàn hảo!" : `Hoàn thành • ${score}/${quizzes.length} đúng`}</span>}
      </div>

      {quizzes.map((q, qi) => {
        const revealed = picked[qi] !== undefined;
        const isCorrect = picked[qi] === q.answer;
        return (
          <div className="quiz-card" key={qi}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>Câu {qi + 1}</strong>
              <span className="chip">{q.type === "split" ? "Tách âm tiết" : "Ghép âm / Kiến thức"}</span>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.6, margin: "12px 0 8px", fontWeight: 600 }}>{q.question}</p>
            {q.options.map((opt, oi) => {
              const isPicked = picked[qi] === oi;
              const cls = revealed && oi === q.answer ? "quiz-opt correct" : revealed && isPicked ? "quiz-opt wrong" : "quiz-opt";
              const icon = revealed && oi === q.answer ? "✓ " : revealed && isPicked ? "✕ " : "";
              return <button key={oi} className={cls} disabled={revealed} onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}>{icon}{opt}</button>;
            })}
            {revealed && <div className={`explain ${isCorrect ? "ok" : "err"}`}><strong>{isCorrect ? "Đúng rồi! " : "Chưa đúng. "}</strong>{q.explain ?? ""}</div>}
          </div>
        );
      })}
    </div>
  );
}
