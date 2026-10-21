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
          <a className="brand" href="/">🇨🇳 Học tiếng Trung</a>
          <nav>
            <a href="/">Bài học</a>
            <AuthStatus />
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">Học theo từng bài — mỗi bài gồm bài học, audio, flashcard và luyện tập.</footer>
      </body>
    </html>
  );
}
