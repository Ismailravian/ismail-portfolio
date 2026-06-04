import { SceneBackground } from "@/components/three/SceneBackground";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Footer } from "@/components/ui/Footer";
import { getProfile, getProjects } from "@/lib/data/queries";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default async function HomePage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <>
      <SceneBackground variant="hero" />

      <Hero profile={profile} />

      {featured.length > 0 && (
        <Section
          id="projects"
          eyebrow="Featured work"
          title="Selected projects"
          subtitle="A handful of recent builds. Click any card to watch the demo and read the case study."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      )}

      {others.length > 0 && (
        <Section
          eyebrow="More"
          title="Other projects"
          subtitle="Side projects, experiments, and open source."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      )}

      <Section
        id="contact"
        eyebrow="Say hi"
        title="Let's build something."
        subtitle="Open to interesting work, collaborations and conversations."
      >
        <div className="flex flex-wrap items-center gap-3">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="group px-5 py-3 rounded-full bg-fg text-bg text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Mail className="h-4 w-4" /> {profile.email}
            </a>
          )}
          <Link
            href="/profile"
            className="group px-5 py-3 rounded-full glass text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
          >
            About me
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </Section>

      <Footer />
    </>
  );
}
