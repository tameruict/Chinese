"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setEmail(session?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  async function logout() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setEmail(null);
  }
  if (email) return (
    <span className="auth-email">
      <span className="avatar-dot">{email.slice(0, 1)}</span>
      <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</span>
      <button className="logout-btn" onClick={logout}>Đăng xuất</button>
    </span>
  );
  return <a className="auth-pill" href="/login">Đăng nhập</a>;
}
