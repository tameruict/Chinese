"use client";
import { useEffect, useState } from "react";
import type { LessonContent } from "@/lib/supabase";

type Audio = NonNullable<LessonContent["audio"]>[number];

function parseTask(line: string, idx: number) {
  const text = line.trim();
  const colon = text.indexOf(":");
  let title = `Việc ${idx + 1}`;
  let body = text;
  if (colon > 0 && colon < 52) {
    title = text.slice(0, colon).trim();
    body = text.slice(colon + 1).trim();
  }
  // Tách lưu ý
  let note = "";
  const m = body.match(/^(.*?)\s*Lưu ý[^:]*:\s*(.*)$/s);
  if (m) { body = m[1].trim(); note = m[2].trim(); }

  const hay = `${title} ${body}`;
  const send = /gửi Fanpage|thu âm|thu gửi/i.test(hay) && !/không cần thu/i.test(hay);
  const selfOnly = /tự luyện|không cần thu/i.test(hay);
  let slideHint = "";
  if (/thanh 4/i.test(hay)) slideHint = "Audio slide 33";
  else if (/điền.*phiên âm|điền.*pinyin/i.test(hay)) slideHint = "Audio slide 34";
  else if (/2a|2b|2c/i.test(hay)) slideHint = "Audio slide 31–32";
  else if (/bài 1/i.test(hay)) slideHint = "Audio slide 31";

  return { title, body, note, send, selfOnly, slideHint };
}

export default function Homework({ lines, audio, lessonSlug }: { lines: string[]; audio: Audio[]; lessonSlug: string }) {
  const tasks = lines.map(parseTask);
  const storageKey = `hw:${lessonSlug}`;
  const [done, setDone] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  function toggle(i: number) {
    setDone((prev) => {
      const next = tasks.map((_, j) => (j === i ? !prev[j] : !!prev[j]));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  const doneCount = tasks.filter((_, i) => done[i]).length;

  if (!tasks.length) {
    return <div className="content-card"><p>Bài này chưa có bài tập về nhà riêng — xem phần luyện tập để ôn bài nhé.</p></div>;
  }

  return (
    <div>
      <div className="hw-progress">
        <div>
          <strong>Đã làm {doneCount}/{tasks.length} việc</strong>
          <div className="meta">Theo slide gốc của bài học • tick vào ô khi làm xong, trạng thái được lưu trên máy này.</div>
        </div>
        <div className="hw-progress-track"><i style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} /></div>
      </div>

      {tasks.map((t, i) => (
        <div className={`hw-card ${done[i] ? "done" : ""}`} key={i}>
          <button className="hw-check" onClick={() => toggle(i)} aria-label={done[i] ? "Bỏ đánh dấu" : "Đánh dấu đã làm"}>
            {done[i] ? "✓" : ""}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hw-title-row">
              <strong>{t.title}</strong>
              {t.send && <span className="hw-tag send">📤 Gửi Fanpage</span>}
              {t.selfOnly && <span className="hw-tag self">Tự luyện</span>}
              {t.slideHint && <span className="hw-tag audio">🎧 {t.slideHint}</span>}
            </div>
            <p className="hw-body">{t.body}</p>
            {t.note && <div className="callout warn" style={{ marginTop: 10 }}><span className="callout-icon">⚠</span><p>{t.note}</p></div>}
          </div>
        </div>
      ))}

      {audio.length > 0 && (
        <section className="lecture-section" style={{ marginTop: 22 }}>
          <div className="lecture-head">
            <span className="lecture-num">🎧</span>
            <div>
              <h3>Audio bài tập về nhà</h3>
              <p>{audio.length} track • slide 31–34 của bài gốc</p>
            </div>
          </div>
          <div className="lecture-body">
            {audio.map((a) => (
              <div className="audio-row compact" key={a.src}>
                <div className="audio-icon">▶</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{a.title}</strong> <span className="meta">• {a.duration}</span>
                  <audio controls preload="none" src={a.src} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
