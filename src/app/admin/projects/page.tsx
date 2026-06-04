import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { getProjects } from "@/lib/data/queries";
import { deleteProjectAction } from "@/app/admin/actions";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-muted text-sm">{projects.length} total</p>
        </div>
        <Link href="/admin/projects/new"
          className="px-4 py-2 rounded-xl bg-fg text-bg font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> New project
        </Link>
      </header>

      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {p.featured && <Star className="h-4 w-4 text-amber-400" />}
                <Link href={`/projects/${p.slug}`} className="font-medium hover:text-accent truncate">
                  {p.title}
                </Link>
              </div>
              <p className="text-sm text-muted truncate">{p.tagline}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/projects/${p.id}/edit`}
                className="px-3 py-1.5 rounded-lg bg-card/60 hover:bg-accent/20 text-sm flex items-center gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={async () => { "use server"; await deleteProjectAction(p.id); }}>
                <button type="submit"
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-sm flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
