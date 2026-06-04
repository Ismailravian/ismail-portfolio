import type { Profile, Project } from "@/lib/types";

export const SEED_PROFILE: Profile = {
  id: "seed",
  name: "Ismail",
  headline: "Software Engineer — building the web in 3D",
  bio: "I design and ship modern web experiences with TypeScript, React, and a dash of WebGL. I love clean code, fast pages, and tasteful motion.",
  avatar_url: null,
  location: "Earth",
  email: "ismailravian541@gmail.com",
  phone: null,
  linkedin_url: "https://www.linkedin.com/in/your-handle",
  github_url: "https://github.com/your-handle",
  resume_url: null,
  skills: [
    "TypeScript", "React", "Next.js", "Node.js",
    "Three.js", "TailwindCSS", "Postgres", "Supabase",
  ],
  experience: [
    {
      company: "Acme Studio",
      role: "Frontend Engineer",
      start: "2024-01",
      end: null,
      summary: "Built marketing sites and dashboards in Next.js with custom 3D scenes.",
    },
  ],
  education: [
    {
      school: "Your University",
      degree: "B.Sc. Computer Science",
      start: "2020-09",
      end: "2024-06",
    },
  ],
};

export const SEED_PROJECTS: Project[] = [
  {
    id: "seed-1",
    slug: "neon-dashboard",
    title: "Neon Dashboard",
    tagline: "Realtime analytics with WebSocket streams",
    description:
      "A realtime analytics dashboard with custom charts, WebSocket data feeds, and a 3D KPI scene built in React Three Fiber.\n\nFeatures include live data updates, custom theming, and a responsive layout that works on all screen sizes.",
    cover_url: null,
    video_url: null,
    demo_url: "https://example.com",
    github_url: "https://github.com/your-handle/neon-dashboard",
    vercel_url: "https://example.vercel.app",
    linkedin_url: null,
    tech: ["Next.js", "WebSockets", "Three.js", "Postgres"],
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-2",
    slug: "voxel-portfolio",
    title: "Voxel Portfolio",
    tagline: "An interactive voxel world you can walk through",
    description:
      "Immersive WebGL portfolio with a navigable voxel scene, custom shaders, and post-processing bloom.\n\nBuilt entirely in Three.js with custom GLSL shaders for the voxel rendering and ambient occlusion.",
    cover_url: null,
    video_url: null,
    demo_url: "https://example.com",
    github_url: null,
    vercel_url: null,
    linkedin_url: null,
    tech: ["Three.js", "GLSL", "React"],
    featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-3",
    slug: "ai-notes",
    title: "AI Notes",
    tagline: "Local-first notes app with LLM-powered search",
    description:
      "A notes app with semantic search powered by embeddings, fully local-first with sync, plus a slash-command palette.\n\nUses SQLite for local storage and a vector index for semantic search.",
    cover_url: null,
    video_url: null,
    demo_url: null,
    github_url: "https://github.com/your-handle/ai-notes",
    vercel_url: null,
    linkedin_url: null,
    tech: ["TypeScript", "SQLite", "Embeddings"],
    featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];
