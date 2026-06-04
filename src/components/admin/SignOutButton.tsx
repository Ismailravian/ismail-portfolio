"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 text-sm"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
