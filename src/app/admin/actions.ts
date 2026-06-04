"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const urlOrEmpty = z.string().url().optional().or(z.literal(""));

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().min(1),
  description: z.string().min(1),
  cover_url: urlOrEmpty,
  video_url: urlOrEmpty,
  demo_url: urlOrEmpty,
  github_url: urlOrEmpty,
  vercel_url: urlOrEmpty,
  linkedin_url: urlOrEmpty,
  tech: z.string().optional(),
  featured: z.string().optional(),
  sort_order: z.coerce.number().optional(),
});

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  return supabase;
}

function toRow(input: z.infer<typeof projectSchema>) {
  return {
    title: input.title,
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.title),
    tagline: input.tagline,
    description: input.description,
    cover_url: input.cover_url || null,
    video_url: input.video_url || null,
    demo_url: input.demo_url || null,
    github_url: input.github_url || null,
    vercel_url: input.vercel_url || null,
    linkedin_url: input.linkedin_url || null,
    tech: (input.tech ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    featured: input.featured === "on" || input.featured === "true",
    sort_order: input.sort_order ?? 0,
  };
}

export async function createProjectAction(formData: FormData) {
  const supabase = await requireUser();
  const parsed = projectSchema.parse(Object.fromEntries(formData));
  const row = toRow(parsed);
  const { error } = await supabase.from("projects").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await requireUser();
  const parsed = projectSchema.parse(Object.fromEntries(formData));
  const row = toRow(parsed);
  const { error } = await supabase.from("projects").update(row).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  bio: z.string().min(1),
  avatar_url: urlOrEmpty,
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedin_url: urlOrEmpty,
  github_url: urlOrEmpty,
  resume_url: urlOrEmpty,
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
});

export async function updateProfileAction(formData: FormData) {
  const supabase = await requireUser();
  const parsed = profileSchema.parse(Object.fromEntries(formData));

  const row = {
    name: parsed.name,
    headline: parsed.headline,
    bio: parsed.bio,
    avatar_url: parsed.avatar_url || null,
    location: parsed.location || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    linkedin_url: parsed.linkedin_url || null,
    github_url: parsed.github_url || null,
    resume_url: parsed.resume_url || null,
    skills: (parsed.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    experience: parsed.experience ? JSON.parse(parsed.experience) : [],
    education: parsed.education ? JSON.parse(parsed.education) : [],
  };

  const { data: existing } = await supabase.from("profile").select("id").limit(1).maybeSingle();
  const { error } = existing
    ? await supabase.from("profile").update(row).eq("id", existing.id)
    : await supabase.from("profile").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
