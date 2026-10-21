"use client";
import { useState } from "react";
import type { Quiz as QuizType } from "@/lib/supabase";

export default function Quiz({ quizzes }: { quizzes: QuizType[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  if (!quizzes?.length) return <p>Bài này chưa có câu luyện tập.</p>;
  const done = Object.keys(picked).length;
  const score = quizzes.reduce((s, q, i) => s + (picked[i] === q.answer ? 1 : 0), 0);
  return (
    <div>
      {quizzes.map((q, qi) => (
        <div className="card" key={qi}>
          <p><strong>Câu {qi + 1}</strong> <span className="meta">({q.type === "split" ? "Tách âm tiết" : "Ghép âm / kiến thức"})</span></p>
          <p>{q.question}</p>
          {q.options.map((opt, oi) => {
            const isPicked = picked[qi] === oi;
            const revealed = picked[qi] !== undefined;
            const cls = revealed && oi === q.answer ? "quiz-opt correct" : revealed && isPicked ? "quiz-opt wrong" : "quiz-opt";
            return <button key={oi} className={cls} disabled={revealed} onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}>{opt}</button>;
          })}
          {picked[qi] !== undefined && <p className={picked[qi] === q.answer ? "ok" : "err"}>{picked[qi] === q.answer ? "Đúng!" : "Chưa đúng."} {q.explain ?? ""}</p>}
        </div>
      ))}
      <p className="progress">Đã làm {done}/{quizzes.length} câu · Điểm: {score}/{quizzes.length}</p>
    </div>
  );
}
