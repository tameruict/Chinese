import type { Metadata } from "next";
import "./globals.css";
import AuthStatus from "@/components/AuthStatus";

export const metadata: Metadata = {
  title: "Học tiếng Trung — DAUTRUONGHOCTAP",
  description: "Web học tiếng Trung theo từng bài: bài học, audio phát âm, flashcard và luyện tập.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header className="site-header">
          <a className="brand" href="/">
            <span className="brand-mark">汉</span>
            <span>Học Tiếng Trung<small>DAUTRUONGHOCTAP</small></span>
          </a>
          <nav>
            <a href="/">Bài học</a>
            <a href="/#lessons">Từ vựng</a>
            <a href="/#lessons">Luyện tập</a>
            <AuthStatus />
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <strong>Học Tiếng Trung — DAUTRUONGHOCTAP</strong>
          <div style={{ marginTop: 6 }}>Học theo từng bài • Audio phát âm • Flashcard SRS • Luyện tập trắc nghiệm — tiến độ đồng bộ qua Supabase.</div>
        </footer>
      </body>
    </html>
  );
}
