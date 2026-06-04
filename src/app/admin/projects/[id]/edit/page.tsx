import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProjectAction } from "@/app/admin/actions";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SEED_PROJECTS } from "@/lib/data/seed";
import type { Project } from "@/lib/types";

async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return SEED_PROJECTS.find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return (data as Project | null) ?? null;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateProjectAction(id, formData);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Edit project</h1>
        <p className="text-muted text-sm">Updating: {project.title}</p>
      </header>
      <div className="glass rounded-2xl p-6">
        <ProjectForm action={action} project={project} />
      </div>
    </div>
  );
}
