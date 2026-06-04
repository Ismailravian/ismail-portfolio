import { getProfile } from "@/lib/data/queries";
import { updateProfileAction } from "@/app/admin/actions";
import { Save } from "lucide-react";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted text-sm">Drives the homepage hero, /profile page, and the auto-generated PDF CV.</p>
      </header>

      <form action={updateProfileAction} className="glass rounded-2xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" name="name" defaultValue={profile.name} required />
          <Field label="Headline" name="headline" defaultValue={profile.headline} required />
        </div>
        <Textarea label="Bio" name="bio" defaultValue={profile.bio} required rows={4} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email" name="email" type="email" defaultValue={profile.email ?? ""} />
          <Field label="Phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Location" name="location" defaultValue={profile.location ?? ""} />
          <Field label="Avatar URL" name="avatar_url" defaultValue={profile.avatar_url ?? ""} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="GitHub URL" name="github_url" defaultValue={profile.github_url ?? ""} />
          <Field label="LinkedIn URL" name="linkedin_url" defaultValue={profile.linkedin_url ?? ""} />
        </div>
        <Field label="Skills (comma-separated)" name="skills" defaultValue={profile.skills.join(", ")} />
        <Textarea
          label="Experience (JSON array of {company, role, start, end, summary})"
          name="experience"
          defaultValue={JSON.stringify(profile.experience, null, 2)}
          rows={6}
        />
        <Textarea
          label="Education (JSON array of {school, degree, start, end, summary?})"
          name="education"
          defaultValue={JSON.stringify(profile.education, null, 2)}
          rows={6}
        />

        <button type="submit"
          className="px-4 py-2 rounded-xl bg-fg text-bg font-medium text-sm flex items-center gap-2">
          <Save className="h-4 w-4" /> Save profile
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", defaultValue, required }: any) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full px-3 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  );
}

function Textarea({ label, name, defaultValue, required, rows = 4 }: any) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="mt-1 w-full px-3 py-2 rounded-xl bg-card border border-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  );
}
