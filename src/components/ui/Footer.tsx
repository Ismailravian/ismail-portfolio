import { getProfile } from "@/lib/data/queries";
import { Github, Linkedin, Mail } from "lucide-react";

export async function Footer() {
  const profile = await getProfile();
  return (
    <footer className="mt-24 mb-10 px-6">
      <div className="max-w-5xl mx-auto glass rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, Three.js and ☕.
        </p>
        <div className="flex items-center gap-3">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub"
              className="h-9 w-9 rounded-full grid place-items-center bg-card/60 hover:bg-accent/20 transition-colors">
              <Github className="h-4 w-4" />
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn"
              className="h-9 w-9 rounded-full grid place-items-center bg-card/60 hover:bg-accent/20 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email"
              className="h-9 w-9 rounded-full grid place-items-center bg-card/60 hover:bg-accent/20 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
