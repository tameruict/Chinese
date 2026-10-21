import type { LessonContent } from "@/lib/supabase";

type Section = NonNullable<LessonContent["sections"]>[number];
type Audio = NonNullable<LessonContent["audio"]>[number];

/* ---------- helpers: bóc tách chuỗi bài giảng thành cấu trúc ---------- */

// "bàba (bố)" -> { main: "bàba", note: "bố" }
function parseExample(raw: string) {
  const m = raw.trim().match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (m) return { main: m[1].trim(), note: m[2].trim() };
  return { main: raw.trim(), note: "" };
}

function ExampleChips({ text }: { text: string }) {
  const items = text.replace(/\.\s*$/, "").split(/,\s+/).map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="ex-chips">
      {items.map((it, i) => {
        const ex = parseExample(it);
        return (
          <span className="ex-chip" key={i}>
            <b>{ex.main}</b>
            {ex.note && <span>{ex.note}</span>}
          </span>
        );
      })}
    </div>
  );
}

function SyllableGrid({ text }: { text: string }) {
  const items = text.replace(/\.\s*$/, "").split(/,\s+/).map((s) => s.trim()).filter(Boolean);
  return (
    <div className="syll-grid">
      {items.map((s, i) => (
        <span className="syll" key={i}>{s}</span>
      ))}
    </div>
  );
}

function Callout({ text, warn = false }: { text: string; warn?: boolean }) {
  return (
    <div className={warn ? "callout warn" : "callout"}>
      <span className="callout-icon">{warn ? "⚠" : "💡"}</span>
      <p>{text}</p>
    </div>
  );
}

// Tách phần "Chú ý: ..." / "Lưu ý ..." ra khỏi đoạn chính
function splitNote(text: string): { main: string; note: string; warn: boolean } {
  const m = text.match(/^(.*?)\s*(Chú ý|Lưu ý[^:]*):\s*(.*)$/s);
  if (m) return { main: m[1].trim(), note: m[3].trim(), warn: m[2].startsWith("Lưu ý") };
  return { main: text, note: "", warn: false };
}

/* ---------- render từng dòng nội dung ---------- */

function RenderLine({ line }: { line: string }) {
  const text = line.trim();
  if (!text) return null;

  // 1) Danh sách đánh số kiểu "1. ... 2. ... 3. ..." -> lưới ô đánh số (VD: 9 quy tắc viết)
  const numbered = text.match(/^\d+\.\s/);
  const numCount = (text.match(/\d+\.\s/g) ?? []).length;
  if (numbered && numCount >= 3) {
    const items = text.split(/(?=\d+\.\s)/).map((s) => s.replace(/^\d+\.\s*/, "").replace(/\.\s*$/, "").trim()).filter(Boolean);
    return (
      <div className="rule-grid">
        {items.map((it, i) => (
          <div className="rule-card" key={i}>
            <span className="rule-num">{i + 1}</span>
            <p>{it}</p>
          </div>
        ))}
      </div>
    );
  }

  // 2) "Nhóm b, p, m, f: <ví dụ>. Chú ý: ..." -> card nhóm
  if (text.startsWith("Nhóm ") && text.includes(":")) {
    const colon = text.indexOf(":");
    const label = text.slice(0, colon).replace(/^Nhóm\s*/, "");
    const letters = label.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
    const { main, note } = splitNote(text.slice(colon + 1).trim());
    return (
      <div className="group-card">
        <div className="group-head">
          <span className="group-label">Nhóm</span>
          <div className="letter-badges">
            {letters.map((l, i) => <span className="letter-badge" key={i}>{l}</span>)}
          </div>
        </div>
        <ExampleChips text={main} />
        {note && <Callout text={note} />}
      </div>
    );
  }

  // 3) "Ghép âm mẫu: ba, pa, ..." / "Bảng luyện đọc: ..." -> lưới âm tiết
  const gridMatch = text.match(/^(Ghép âm[^:]*|Bảng luyện đọc[^:]*):\s*(.*)$/s);
  if (gridMatch) {
    return (
      <div className="sub-block">
        <div className="sub-label">{gridMatch[1]}</div>
        <SyllableGrid text={gridMatch[2]} />
      </div>
    );
  }

  // 4) "Vận mẫu đơn: a, o, e... <ghi chú>" / "Vận mẫu kép: ai, ei... Ví dụ: ..."
  const vmMatch = text.match(/^(Vận mẫu (?:đơn|kép)):\s*(.*)$/s);
  if (vmMatch) {
    let rest = vmMatch[2];
    let examples = "";
    const exIdx = rest.search(/Ví dụ:\s*/);
    if (exIdx >= 0) {
      examples = rest.slice(exIdx).replace(/^Ví dụ:\s*/, "");
      rest = rest.slice(0, exIdx).trim();
    }
    const firstDot = rest.indexOf(". ");
    const listPart = firstDot >= 0 ? rest.slice(0, firstDot) : rest;
    const notesPart = firstDot >= 0 ? rest.slice(firstDot + 2) : "";
    const notes = notesPart.split(/;\s*/).map((s) => s.trim()).filter(Boolean);
    return (
      <div className="sub-block">
        <div className="sub-label">{vmMatch[1]}</div>
        <div className="ex-chips">
          {listPart.split(/,\s+/).map((v, i) => (
            <span className="ex-chip vowel" key={i}><b>{v.trim().replace(/\.$/, "")}</b></span>
          ))}
        </div>
        {notes.length > 0 && (
          <ul className="note-list">
            {notes.map((n, i) => <li key={i}>{n.replace(/\.\s*$/, "")}</li>)}
          </ul>
        )}
        {examples && (
          <>
            <div className="sub-label small">Ví dụ</div>
            <ExampleChips text={examples} />
          </>
        )}
      </div>
    );
  }

  // 5) "Ví dụ: ..." thuần -> hàng chip ví dụ
  if (text.startsWith("Ví dụ:")) {
    return (
      <div className="sub-block">
        <div className="sub-label">Ví dụ</div>
        <ExampleChips text={text.replace(/^Ví dụ:\s*/, "")} />
      </div>
    );
  }

  // 6) Dòng có nhãn ngắn trước ":" + danh sách phẩy (VD: "6 cách cấu tạo...", "Nét cơ bản: ...; nét móc: ...")
  const colon = text.indexOf(":");
  if (colon > 0 && colon < 42) {
    const label = text.slice(0, colon);
    const rest = text.slice(colon + 1).trim();
    // Nhiều cụm "; nhãn: danh sách" -> render từng hàng
    if (rest.includes(";") && (rest.match(/:/g) ?? []).length >= 1) {
      const parts = rest.split(/;\s*/).filter(Boolean);
      return (
        <div className="sub-block">
          <div className="sub-label">{label}</div>
          {parts.map((p, i) => {
            const c2 = p.indexOf(":");
            if (c2 > 0 && c2 < 24) {
              return (
                <div className="kv-row" key={i}>
                  <span className="kv-label">{p.slice(0, c2)}</span>
                  <div className="ex-chips">
                    {p.slice(c2 + 1).split(/,\s+/).map((v, j) => <span className="ex-chip" key={j}><b>{v.trim()}</b></span>)}
                  </div>
                </div>
              );
            }
            return <p className="lecture-p" key={i}>{p}</p>;
          })}
        </div>
      );
    }
    // Danh sách ngắn không có ngoặc -> ô đánh số nếu là các mục phân loại
    const items = rest.replace(/\.\s*$/, "").split(/,\s+/).filter(Boolean);
    const isPlainList = items.length >= 3 && items.every((s) => s.length < 26 && !s.includes("("));
    if (isPlainList) {
      return (
        <div className="sub-block">
          <div className="sub-label">{label}</div>
          <div className="tile-grid">
            {items.map((it, i) => (
              <div className="tile" key={i}><span className="tile-num">{i + 1}</span><p>{it}</p></div>
            ))}
          </div>
        </div>
      );
    }
    // Nhãn + nội dung dài: nhãn thành tiêu đề nhỏ, nội dung là đoạn văn (tách Lưu ý nếu có)
    const { main, note, warn } = splitNote(rest);
    return (
      <div className="sub-block">
        <div className="sub-label">{label}</div>
        <p className="lecture-p">{main}</p>
        {note && <Callout text={note} warn={warn} />}
      </div>
    );
  }

  // 7) Mặc định: đoạn văn (tách Chú ý / Lưu ý nếu có)
  const { main, note, warn } = splitNote(text);
  return (
    <>
      <p className="lecture-p">{main}</p>
      {note && <Callout text={note} warn={warn} />}
    </>
  );
}

/* ---------- render blocks chi tiết (nội dung v2) ---------- */

import type { LessonBlock, ExItem } from "@/lib/supabase";

function ExCards({ items }: { items: ExItem[] }) {
  return (
    <div className="ex-cards">
      {items.map((ex, i) => (
        <div className="ex-card" key={i}>
          {ex.hanzi && <span className="ex-hanzi">{ex.hanzi}</span>}
          <span className="ex-meta">
            <b>{ex.pinyin}</b>
            {ex.meaning && <span>{ex.meaning}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

function RenderBlock({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="lecture-p lead">{block.text}</p>;
    case "callout":
      return <Callout text={block.text} warn={block.warn} />;
    case "subhead":
      return <div className="sub-label" style={{ marginTop: 6 }}>{block.text}</div>;
    case "phonetics":
      return (
        <div className="phon-grid">
          {block.items.map((it, i) => (
            <div className="phon-card" key={i}>
              <div className="phon-top">
                <span className="phon-symbol">{it.symbol}</span>
              </div>
              <p className="phon-guide">{it.guide}</p>
              {it.examples && it.examples.length > 0 && <ExCards items={it.examples} />}
            </div>
          ))}
        </div>
      );
    case "examples":
      return (
        <div className="sub-block">
          {block.title && <div className="sub-label">{block.title}</div>}
          <ExCards items={block.items} />
        </div>
      );
    case "grid":
      return (
        <div className="sub-block">
          {block.title && <div className="sub-label">{block.title}</div>}
          <SyllableGrid text={block.items.join(", ")} />
        </div>
      );
    case "tones":
      return (
        <div className="tone-grid">
          {block.items.map((t, i) => (
            <div className="tone-card" key={i}>
              <div className="tone-top">
                <span className="tone-name">{t.name}</span>
                <span className="tone-mark">{t.mark}</span>
                <span className="tone-pitch">{t.pitch}</span>
              </div>
              <p className="phon-guide">{t.desc}</p>
              {t.examples && t.examples.length > 0 && <ExCards items={t.examples} />}
            </div>
          ))}
        </div>
      );
    case "concepts":
      return (
        <div className="concept-grid">
          {block.items.map((c, i) => (
            <div className="concept-card" key={i}>
              <div className="concept-main">
                <div className="concept-title">{i + 1}. {c.title}</div>
                <p className="phon-guide">{c.desc}</p>
                {c.example && <p className="concept-example">{c.example}</p>}
              </div>
              {c.hanzi && (
                <div className="concept-hanzi">
                  <span>{c.hanzi}</span>
                  {c.pinyin && <small>{c.pinyin}</small>}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    case "strokes":
      return (
        <>
          {block.groups.map((g, gi) => (
            <div className="sub-block" key={gi}>
              <div className="sub-label">{g.label}</div>
              <div className="stroke-grid">
                {g.items.map((s, i) => (
                  <div className="stroke-card" key={i}>
                    {s.glyph && <span className="stroke-glyph">{s.glyph}</span>}
                    <span className="stroke-name">{s.name}</span>
                    {s.desc && <span className="stroke-desc">{s.desc}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    case "rules":
      return (
        <div className="rule-grid detailed">
          {block.items.map((r, i) => (
            <div className="rule-card" key={i}>
              <span className="rule-num">{i + 1}</span>
              <div>
                <p>{r.text}</p>
                {r.hanzi && <div className="rule-example"><b>{r.hanzi}</b>{r.example && <span>{r.example}</span>}</div>}
              </div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/* ---------- audio gắn theo mục ---------- */

function AudioBlock({ items }: { items: Audio[] }) {
  if (!items.length) return null;
  return (
    <div className="audio-block">
      <div className="sub-label">🎧 Nghe kèm mục này</div>
      {items.map((a) => (
        <div className="audio-row compact" key={a.src}>
          <div className="audio-icon">▶</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{a.title}</strong> <span className="meta">• {a.duration}</span>
            <audio controls preload="none" src={a.src} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Map audio bài giảng vào đúng mục theo slide / id mục
function audioForSection(sectionId: string, audio: Audio[]): Audio[] {
  return audio.filter((a) => {
    const slide = parseInt(String(a.slide).split("-")[0], 10);
    if (sectionId === "van-mau") return slide >= 5 && slide <= 10;
    if (sectionId === "thanh-dieu") return slide === 13 || slide === 15;
    return false;
  });
}

/* ---------- component chính ---------- */

export default function Lecture({ sections, audio }: { sections: Section[]; audio: Audio[] }) {
  const usedAudio = new Set<string>();
  return (
    <div>
      {/* Mục lục nội bộ — chỉ các mục bài giảng, không trộn Audio/Flashcard/BTVN */}
      <nav className="lecture-toc" aria-label="Mục lục bài giảng">
        {sections.map((s, i) => (
          <a key={s.id} href={`#lec-${s.id}`}>
            <span>{String(i + 1).padStart(2, "0")}</span>{s.title.replace(/^[IVX]+\.\s*/, "")}
          </a>
        ))}
      </nav>

      {sections.map((s, idx) => {
        const secAudio = audioForSection(s.id, audio);
        secAudio.forEach((a) => usedAudio.add(a.src));
        return (
          <section key={s.id} id={`lec-${s.id}`} className="lecture-section">
            <div className="lecture-head">
              <span className="lecture-num">{String(idx + 1).padStart(2, "0")}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.blocks?.length ? `${s.blocks.length} phần chi tiết` : `${s.body.length} phần nhỏ`} • đọc khoảng {Math.max(1, Math.round(JSON.stringify(s.blocks ?? s.body).length / 900))} phút</p>
              </div>
            </div>
            <div className="lecture-body">
              {s.blocks?.length
                ? s.blocks.map((b, i) => <RenderBlock key={i} block={b} />)
                : s.body.map((line, i) => <RenderLine key={i} line={line} />)}
              <AudioBlock items={secAudio} />
            </div>
          </section>
        );
      })}

      {/* Audio bài giảng nào chưa gắn được vào mục thì để cuối tab, không bỏ sót */}
      {audio.filter((a) => !usedAudio.has(a.src)).length > 0 && (
        <section className="lecture-section">
          <div className="lecture-head">
            <span className="lecture-num">🎧</span>
            <div><h3>Audio khác của bài</h3><p>Nghe thêm ngoài các mục trên</p></div>
          </div>
          <div className="lecture-body">
            <AudioBlock items={audio.filter((a) => !usedAudio.has(a.src))} />
          </div>
        </section>
      )}
    </div>
  );
}
