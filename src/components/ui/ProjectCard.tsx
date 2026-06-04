"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { useRef, type MouseEvent } from "react";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateZ(0)`;
  }
  function reset() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group [perspective:900px]"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.18s ease-out" }}
        className="relative glass rounded-3xl overflow-hidden h-full"
      >
        <Link href={`/projects/${project.slug}`} className="block">
          <div className="relative aspect-video overflow-hidden bg-card">
            {project.cover_url ? (
              <Image
                src={project.cover_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div
                className="absolute inset-0 grid-bg"
                style={{
                  background: `linear-gradient(135deg, rgb(var(--accent) / 0.25), transparent 60%), ` +
                    `radial-gradient(circle at 80% 20%, rgb(236 72 153 / 0.25), transparent 50%)`,
                }}
              />
            )}
            <div className="absolute top-3 right-3 h-9 w-9 rounded-full grid place-items-center bg-fg/85 text-bg opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-display text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-muted mt-1 line-clamp-2">{project.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="px-5 pb-5 flex items-center gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="text-xs flex items-center gap-1 text-muted hover:text-fg transition-colors">
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noreferrer"
              className="text-xs flex items-center gap-1 text-muted hover:text-fg transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
