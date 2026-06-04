import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/app/admin/actions";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">New project</h1>
        <p className="text-muted text-sm">Fill out the details — appears live on your homepage once saved.</p>
      </header>
      <div className="glass rounded-2xl p-6">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
