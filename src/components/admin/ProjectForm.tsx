"use client";

import { useFormStatus } from "react-dom";
import type { Project } from "@/lib/types";
import { Save, Github, ExternalLink, Linkedin, Globe } from "lucide-react";
import { CloudinaryUpload } from "./CloudinaryUpload";

function Field({
  label, name, type = "text", defaultValue, required, placeholder, icon,
}: {
  label: string; name: string; type?: string; defaultValue?: string | number | null;
  required?: boolean; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <div className="relative mt-1">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}

function Textarea({
  label, name, defaultValue, required, rows = 5, placeholder,
}: {
  label: string; name: string; defaultValue?: string | null;
  required?: boolean; rows?: number; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm leading-relaxed"
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-accent border-b border-border pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SubmitButton({ label = "Save project" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-fg text-bg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-105 transition-transform"
    >
      <Save className="h-4 w-4" />
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
}) {
  return (
    <form action={action} className="space-y-8">

      {/* Basic info */}
      <Section title="Basic Info">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Title *"
            name="title"
            defaultValue={project?.title}
            required
            placeholder="My Awesome Project"
          />
          <Field
            label="Slug (auto-generated from title if blank)"
            name="slug"
            defaultValue={project?.slug}
            placeholder="my-awesome-project"
          />
        </div>
        <Field
          label="Tagline *"
          name="tagline"
          defaultValue={project?.tagline}
          required
          placeholder="One sentence that sells the project"
        />
        <Textarea
          label="Description *"
          name="description"
          defaultValue={project?.description}
          required
          rows={7}
          placeholder={`Describe your project in detail.\n\nWhat did you build? What problem does it solve? What was technically interesting?\n\nYou can write multiple paragraphs here — they will be shown on the project detail page.`}
        />
        <Field
          label="Tech stack (comma-separated)"
          name="tech"
          defaultValue={project?.tech.join(", ")}
          placeholder="Next.js, TypeScript, Supabase, Three.js"
        />
      </Section>

      {/* Media */}
      <Section title="Cover Image">
        <CloudinaryUpload
          name="cover_url"
          label="Project cover / thumbnail (shown on project cards)"
          type="image"
          defaultValue={project?.cover_url}
        />
      </Section>

      <Section title="Demo Video">
        <CloudinaryUpload
          name="video_url"
          label="Demo video (upload an MP4, or paste a YouTube/Vimeo URL below)"
          type="video"
          defaultValue={project?.video_url}
        />
        <p className="text-xs text-muted -mt-1">
          YouTube and Vimeo URLs are auto-embedded on the project page. No upload needed for those.
        </p>
      </Section>

      {/* Links */}
      <Section title="Links">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="GitHub repository"
            name="github_url"
            type="url"
            defaultValue={project?.github_url}
            placeholder="https://github.com/you/project"
            icon={<Github className="h-4 w-4" />}
          />
          <Field
            label="Vercel deployment"
            name="vercel_url"
            type="url"
            defaultValue={project?.vercel_url}
            placeholder="https://my-project.vercel.app"
            icon={<ExternalLink className="h-4 w-4" />}
          />
          <Field
            label="Live demo / website"
            name="demo_url"
            type="url"
            defaultValue={project?.demo_url}
            placeholder="https://myproject.com"
            icon={<Globe className="h-4 w-4" />}
          />
          <Field
            label="LinkedIn post / case study"
            name="linkedin_url"
            type="url"
            defaultValue={project?.linkedin_url}
            placeholder="https://linkedin.com/posts/..."
            icon={<Linkedin className="h-4 w-4" />}
          />
        </div>
      </Section>

      {/* Settings */}
      <Section title="Settings">
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured}
                className="peer sr-only"
              />
              <div className="w-10 h-6 rounded-full bg-border peer-checked:bg-accent transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Featured</p>
              <p className="text-xs text-muted">Shown in the "Selected projects" section on the homepage</p>
            </div>
          </label>
          <Field
            label="Sort order (lower = appears first)"
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
          />
        </div>
      </Section>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
