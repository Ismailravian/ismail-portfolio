import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, FolderKanban, UserCog, LogOut } from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="glass rounded-2xl p-4 h-fit md:sticky md:top-24">
          <p className="text-xs uppercase tracking-[0.3em] text-accent px-2 mb-3">Admin</p>
          <nav className="space-y-1 text-sm">
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/15">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/15">
              <FolderKanban className="h-4 w-4" /> Projects
            </Link>
            <Link href="/admin/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/15">
              <UserCog className="h-4 w-4" /> Profile
            </Link>
            <SignOutButton />
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
