"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) { setMsg("Chưa cấu hình Supabase."); return; }
    setBusy(true); setMsg(null);
    const res = mode === "signin"
      ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password });
    setBusy(false);
    if (res.error) setMsg("Lỗi: " + res.error.message);
    else if (mode === "signup" && !res.data.session) setMsg("Đã đăng ký. Nếu Supabase yêu cầu xác nhận email, hãy mở hộp thư để xác nhận rồi đăng nhập.");
    else { setMsg("Thành công! Đang chuyển về trang chủ..."); setTimeout(() => { window.location.href = "/"; }, 700); }
  }

  return (
    <div className="login-wrap">
      <aside className="login-side">
        <div>
          <div className="big">学中文</div>
          <p style={{ color: "rgba(255,255,255,.86)", fontSize: 17, lineHeight: 1.6, marginTop: 14 }}>Đồng bộ tiến độ học<br />trên mọi thiết bị.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="chip" style={{ background: "rgba(255,255,255,.16)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>Flashcard SRS</span>
          <span className="chip" style={{ background: "rgba(255,255,255,.16)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>Audio phát âm</span>
          <span className="chip" style={{ background: "rgba(255,255,255,.16)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>Luyện tập</span>
        </div>
      </aside>

      <div className="login-form">
        <h1>{mode === "signin" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h1>
        <p className="meta" style={{ marginBottom: 18 }}>Không đăng nhập vẫn học được ở chế độ khách — tiến độ lưu tạm trên máy này. Đăng nhập để lưu SRS lên Supabase.</p>
        <div className="segmented">
          <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")} type="button">Đăng nhập</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Đăng ký</button>
        </div>
        <form onSubmit={submit}>
          <label>Email<input type="email" required placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Mật khẩu<input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button className="btn btn-primary" disabled={busy} type="submit" style={{ width: "100%", padding: "14px 22px", fontSize: 16 }}>{busy ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập →" : "Đăng ký →"}</button>
        </form>
        {msg && <div className={`explain ${msg.startsWith("Lỗi") ? "err" : "ok"}`} style={{ marginTop: 14 }}>{msg}</div>}
        <p className="meta" style={{ marginTop: 16 }}><a href="/" style={{ color: "#C2410C", fontWeight: 700 }}>← Quay lại học ở chế độ khách</a></p>
      </div>
    </div>
  );
}
