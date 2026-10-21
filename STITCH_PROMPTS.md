# Google Stitch — Prompt Pack cho Web Học Tiếng Trung v2

> Dùng tại: https://stitch.withgoogle.com — đăng nhập Google > New Project > dán từng prompt > Generate > Export Code / Copy to Figma
> Design system chung cho mọi prompt: dán đoạn này vào đầu mỗi prompt.

## Design System (dán kèm mọi prompt)

```
Style: Modern learning app, clean and warm, inspired by Duolingo + Notion + Airbnb.
Colors: Background warm paper #FFF9F2, Surface white, Primary Chinese vermillion #E23A2E, Jade accent #0EA5A4, Gold #F59E0B, Ink #191919, Muted #6B7280.
Typography: Be Vietnam Pro for UI (supports Vietnamese), Noto Serif SC for large Hanzi display.
Shape: Rounded corners 20-24px on cards, 999px on pills/buttons, soft shadow 0 8px 30px rgba(0,0,0,0.06), 1px border #F1E6D8.
Layout: Max width 1120px, generous whitespace, sticky glass header with blur.
Language: UI text in Vietnamese.
No purple/blue gradients. Use warm red-to-orange subtle gradient only in hero.
```

## Prompt 1 — Homepage / Danh sách bài học

```
Design a homepage for a Vietnamese Chinese-learning web app called "Học Tiếng Trung — DAUTRUONGHOCTAP".
[+ Design System above]
Include:
- Sticky glass header: logo mark with character "汉" in red rounded square, nav "Bài học, Từ vựng, Luyện tập", login button pill.
- Hero section: large headline "Học tiếng Trung, từng bài một cách vững chắc", subtext explaining lessons include audio, flashcards and quizzes, CTA buttons "Tiếp tục học Bài 1" (primary) and "Xem tất cả bài học" (secondary), decorative large faded Hanzi "你好" on the right, stats pills: "15 bài • Quyển 1", "25 từ vựng", "10 audio".
- Lesson grid: cards in 2 columns, each card has gradient cover area with big Hanzi, title "Bài 1: Xin chào", meta "Quyển 1 • 10 audio • 10 câu quiz", progress bar, arrow icon, hover lift effect.
- Footer simple centered.
Make it feel premium, friendly, and focused on reading comprehension.
```

## Prompt 2 — Trang chi tiết bài học

```
Design a lesson detail page for a Chinese lesson "Bài 1: Xin chào — Thanh mẫu, vận mẫu, thanh điệu".
[+ Design System above]
Include:
- Breadcrumb back link "← Tất cả bài học"
- Lesson hero card: red-orange gradient, white text, title, chips for Book 1, Audio, Flashcards, Quiz counts
- Content sections as white cards with numbered headings: "Thanh mẫu", "Vận mẫu", "Thanh điệu", body text readable 16-17px
- Audio list: rows styled like a music player, play button circle, track title, duration, waveform-like progress line
- Sticky right sidebar on desktop with lesson outline / table of contents
Make reading comfortable, lots of line-height, Hanzi larger than pinyin.
```

## Prompt 3 — Flashcard + Quiz

```
Design two learning components for a Chinese study app.
[+ Design System above]
1) Flashcard: large centered card 3D flip, front shows huge Hanzi "你好" 72px with hint "Chạm để lật thẻ", back shows pinyin in red "nǐ hǎo", Vietnamese meaning "Xin chào", example sentence. Below: 3 grading buttons — green "Nhớ", amber "Lơ mơ", dark "Quên" — and progress "Thẻ 3/25" with progress bar, prev/next buttons.
2) Quiz: question card with progress "Câu 2/10 • Điểm 1", question text, 4 option buttons as full-width rows, correct state green tint with check, wrong state red tint, explanation box below after answering.
Friendly, game-like but not childish.
```

## Prompt 4 — Login

```
Design a login / sign up page for a Vietnamese Chinese-learning app.
[+ Design System above]
Split layout: left panel red-orange gradient with large Hanzi "学中文" and tagline "Đồng bộ tiến độ học trên mọi thiết bị", right panel white form card with tabs "Đăng nhập / Đăng ký", email and password fields with rounded 12px inputs, primary button full width, note that guest mode saves progress locally.
Centered on mobile as single card.
```

## Cách dùng với code hiện tại

1. Generate từng prompt trong Stitch (Standard Mode — Gemini Flash, nhanh)
2. Bấm `Export > Code` — Stitch trả HTML + Tailwind
3. Đối chiếu với bản v2 đã code trong repo `tameruict/Chinese` (`src/app/globals.css` + components) — v2 đã bám sát design system này để anh không phải copy thủ công.
4. Nếu muốn đổi màu/layout: sửa prompt, generate lại, gửi screenshot/link Stitch cho Muse để Muse port lại vào Next.js.
