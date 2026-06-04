import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Project } from "@/lib/types";
import { SEED_PROFILE, SEED_PROJECTS } from "./seed";

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return SEED_PROJECTS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return SEED_PROJECTS;
    return data as Project[];
  } catch {
    return SEED_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
    return data as Project;
  } catch {
    return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) return SEED_PROFILE;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return SEED_PROFILE;
    return data as Profile;
  } catch {
    return SEED_PROFILE;
  }
}
