import Link from "next/link";
import { getProfile, getProjects } from "@/lib/data/queries";
import { FolderKanban, UserCog, FileText, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome back, {profile.name.split(" ")[0]}.
        </h1>
        <p className="text-muted mt-1">Manage your projects and profile. Changes are live immediately.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Projects" value={projects.length} icon={<FolderKanban className="h-4 w-4" />} />
        <Stat label="Featured" value={projects.filter((p) => p.featured).length} icon={<FolderKanban className="h-4 w-4" />} />
        <Stat label="Skills" value={profile.skills.length} icon={<UserCog className="h-4 w-4" />} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/projects/new" className="glass rounded-2xl p-6 hover:bg-accent/10 transition-colors">
          <Plus className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold mt-3">Add a project</h3>
          <p className="text-sm text-muted mt-1">Add a new project with video, description, tech and links.</p>
        </Link>
        <Link href="/admin/profile" className="glass rounded-2xl p-6 hover:bg-accent/10 transition-colors">
          <UserCog className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold mt-3">Edit profile</h3>
          <p className="text-sm text-muted mt-1">Update name, bio, skills, experience and education.</p>
        </Link>
        <Link href="/cv" className="glass rounded-2xl p-6 hover:bg-accent/10 transition-colors">
          <FileText className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold mt-3">Preview CV</h3>
          <p className="text-sm text-muted mt-1">Open the auto-generated PDF, built from the same data.</p>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-widest">
        {icon} {label}
      </div>
      <p className="font-display text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
