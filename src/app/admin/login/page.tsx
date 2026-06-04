"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setError("Supabase isn't configured. Add env vars in .env.local — see README.");
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <form onSubmit={onSubmit} className="glass rounded-3xl p-8 w-full max-w-sm space-y-4">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Admin</p>
          <h1 className="font-display text-2xl font-bold mt-1">Sign in</h1>
        </header>

        <label className="block">
          <span className="text-xs text-muted">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </label>

        <label className="block">
          <span className="text-xs text-muted">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </label>

        {error && (
          <div className="flex items-start gap-2 text-sm text-rose-500 bg-rose-500/10 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-xl bg-fg text-bg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
