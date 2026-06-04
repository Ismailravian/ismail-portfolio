import { SceneBackground } from "@/components/three/SceneBackground";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Footer } from "@/components/ui/Footer";
import { getProjects } from "@/lib/data/queries";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <SceneBackground variant="subtle" />
      <div className="pt-28" />
      <Section
        eyebrow="All work"
        title="Projects"
        subtitle="Everything I've shipped — click any card for a deeper look."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </Section>
      <Footer />
    </>
  );
}
