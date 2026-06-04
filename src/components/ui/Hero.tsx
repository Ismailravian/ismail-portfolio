"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import type { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative min-h-[100svh] grid place-items-center px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.3em] text-accent mb-6"
        >
          Portfolio · {new Date().getFullYear()}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95]"
        >
          Hi, I'm{" "}
          <span className="gradient-text">{profile.name}</span>.
          <br />
          <span className="text-fg/85">{profile.headline.split("—")[1]?.trim() ?? profile.headline}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto"
        >
          {profile.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#projects"
            className="group px-5 py-3 rounded-full bg-fg text-bg text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            View projects
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full glass text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full glass text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-xs animate-float">
        scroll
      </div>
    </section>
  );
}
