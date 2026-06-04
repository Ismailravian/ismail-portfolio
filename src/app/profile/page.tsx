import Link from "next/link";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SceneBackground } from "@/components/three/SceneBackground";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { getProfile, getProjects } from "@/lib/data/queries";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <>
      <SceneBackground variant="subtle" />

      <div className="pt-28 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="glass rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Profile</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              {profile.name}
            </h1>
            <p className="text-muted mt-2">{profile.headline}</p>
            <p className="mt-4 leading-relaxed">{profile.bio}</p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {profile.location && (
                <span className="px-3 py-1 rounded-full bg-card/60 flex items-center gap-1.5 text-muted">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </span>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="px-3 py-1 rounded-full bg-card/60 hover:bg-accent/20 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {profile.email}
                </a>
              )}
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-card/60 hover:bg-accent/20 flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-card/60 hover:bg-accent/20 flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
            </div>

            <div className="mt-6">
              <Link href="/cv"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fg text-bg text-sm font-medium hover:scale-105 transition-transform">
                <Download className="h-4 w-4" /> Download CV (PDF)
              </Link>
            </div>
          </header>
        </div>
      </div>

      <Section eyebrow="Skills" title="What I work with">
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-full glass text-sm">
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section eyebrow="Experience" title="Where I've worked">
        <ul className="space-y-4">
          {profile.experience.map((e, i) => (
            <li key={i} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {e.role} · <span className="text-muted">{e.company}</span>
                </h3>
                <span className="text-sm text-muted">
                  {e.start} — {e.end ?? "Present"}
                </span>
              </div>
              <p className="text-muted mt-2">{e.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Education" title="Where I studied">
        <ul className="space-y-4">
          {profile.education.map((e, i) => (
            <li key={i} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {e.degree} · <span className="text-muted">{e.school}</span>
                </h3>
                <span className="text-sm text-muted">
                  {e.start} — {e.end ?? "Present"}
                </span>
              </div>
              {e.summary && <p className="text-muted mt-2">{e.summary}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Projects" title="Selected work" subtitle="Latest projects sync from the same data — your CV always stays up to date.">
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="glass rounded-2xl p-5 flex items-start justify-between gap-4">
              <div>
                <Link href={`/projects/${p.slug}`} className="font-medium hover:text-accent">
                  {p.title}
                </Link>
                <p className="text-sm text-muted mt-0.5">{p.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">{t}</span>
                  ))}
                </div>
              </div>
              <Link href={`/projects/${p.slug}`} className="text-sm text-muted hover:text-fg">
                View →
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Footer />
    </>
  );
}
