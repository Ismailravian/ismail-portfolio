import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Linkedin } from "lucide-react";
import { SceneBackground } from "@/components/three/SceneBackground";
import { Footer } from "@/components/ui/Footer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { getProjectBySlug, getProjects } from "@/lib/data/queries";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const links = [
    project.github_url   && { label: "GitHub",   href: project.github_url,   icon: <Github      className="h-4 w-4" /> },
    project.vercel_url   && { label: "Vercel",    href: project.vercel_url,   icon: <ExternalLink className="h-4 w-4" /> },
    project.demo_url     && { label: "Live demo", href: project.demo_url,     icon: <ExternalLink className="h-4 w-4" /> },
    project.linkedin_url && { label: "LinkedIn",  href: project.linkedin_url, icon: <Linkedin    className="h-4 w-4" /> },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[];

  return (
    <>
      <SceneBackground variant="subtle" />

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          <header className="mb-10">
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-muted">{project.tagline}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  {t}
                </span>
              ))}
            </div>

            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {links.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full glass text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            )}
          </header>

          {/* Video or Cover */}
          {project.video_url ? (
            <VideoPlayer src={project.video_url} />
          ) : project.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_url}
              alt={project.title}
              className="w-full aspect-video object-cover rounded-2xl glass"
            />
          ) : (
            <div className="aspect-video rounded-2xl glass grid-bg" />
          )}

          {/* Description */}
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold mb-5">About this project</h2>
            <div className="space-y-4">
              {project.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </section>
        </div>
      </article>

      <Footer />
    </>
  );
}
