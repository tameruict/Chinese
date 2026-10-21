# Học tiếng Trung (Chinese Study Web)

Web học tiếng Trung theo từng bài học: mỗi bài gồm nội dung bài học, audio phát âm, flashcard từ vựng (SRS 1-3-7-14-30 ngày) và luyện tập trắc nghiệm.

## Stack

- Next.js (App Router) + TypeScript, CSS thuần
- Supabase: Postgres (lessons, vocab_cards, review_state) + Auth (email/mật khẩu) + Row Level Security
- Deploy: Vercel (region sin1, gần Supabase ap-southeast-1)

## Chạy local

```bash
npm install
cp .env.example .env.local   # điền URL + anon key của project Supabase
npm run dev
```

## Biến môi trường

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL của Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/publishable key (key công khai, dùng ở client kèm RLS). Tuyệt đối không dùng service_role key ở frontend.

## Quyết định về audio (v1)

Audio bản web (MP3 đã nén, Bài 1: 10 file, tổng 7,86 MB) được lưu ở **Supabase Storage** (bucket công khai `lesson-audio`), dữ liệu bài học trong bảng `lessons` giữ URL công khai của từng track và web phát trực tiếp từ đó.
Lý do: file MP3 là binary — quy trình push qua GitHub connector chỉ nhận file văn bản (UTF-8), còn token git trên máy build không có quyền ghi repo này, nên không đưa MP3 vào repo được. Cách này cũng đúng kiến trúc dài hạn: repo chỉ chứa code, thêm bài mới chỉ cần upload audio lên Storage và seed dữ liệu, không phải sửa code.
Thư mục `public/audio/` ở máy local chỉ là bản sao làm việc, đã được .gitignore loại khỏi repo. File PPTX và WAV gốc KHÔNG được đưa lên GitHub (quá nặng).

## Deploy

Web được deploy tự động lên Vercel từ nhánh `main` của repo này (project Vercel: chinese). Audio nằm ở Supabase Storage, dữ liệu ở Supabase Postgres.
