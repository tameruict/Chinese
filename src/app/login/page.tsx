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
    <div>
      <h1>{mode === "signin" ? "Đăng nhập" : "Đăng ký"}</h1>
      <div className="card">
        <form onSubmit={submit}>
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Mật khẩu<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <div className="row">
            <button className="primary" disabled={busy} type="submit">{busy ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}</button>
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}</button>
          </div>
        </form>
        {msg && <p>{msg}</p>}
        <p className="meta">Không đăng nhập vẫn học được ở chế độ khách, tiến độ lưu tạm trên máy. Đăng nhập để lưu tiến độ ôn tập (SRS) lên Supabase và đồng bộ giữa các thiết bị.</p>
      </div>
    </div>
  );
}
