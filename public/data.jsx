// data.jsx — portfolio content. Loads from /api/portfolio-data when available.

const PROFILE = {
  name: "Ismail",
  handle: "ismailravian",
  headline: "software engineer · building the web in 3d",
  bio: "I design and ship modern web experiences. TypeScript by day, GLSL by night. Currently exploring how WebGPU is changing the frontier of browser graphics — and shipping calm, fast interfaces for the people I work with.",
  email: "ismailravian541@gmail.com",
  location: "Lahore · UTC+5",
  status: "Open to new work · 2026",
  github: "github.com/Ismailravian",
  linkedin: "linkedin.com/in/your-handle",
  twitter: "x.com/ismailravian",
  experience: [
    {
      when: "2024 — now",
      role: "Frontend Engineer",
      org: "Acme Studio",
      desc: "Design-engineering for marketing sites and dashboards. Custom Three.js scenes, design systems, and a lot of late-night shader tuning.",
    },
    {
      when: "2020 — 2024",
      role: "B.Sc. Computer Science",
      org: "University",
      desc: "Focused on graphics, distributed systems, and shipping side-projects nobody asked for.",
    },
  ],
  skills: [
    { name: "TypeScript",          lvl: "fluent" },
    { name: "React / Next.js",     lvl: "fluent" },
    { name: "Three.js / WebGL",    lvl: "fluent" },
    { name: "GLSL shaders",        lvl: "shipping" },
    { name: "Postgres / Supabase", lvl: "shipping" },
    { name: "Tailwind / CSS",      lvl: "fluent" },
    { name: "Node.js",             lvl: "shipping" },
    { name: "WebGPU",              lvl: "learning" },
  ],
};

const PROJECTS = [
  {
    slug: "neon-dashboard",
    idx: "01",
    title: "Neon Dashboard",
    tagline: "Realtime analytics with sub-100ms WebSocket feeds.",
    year: "2025",
    status: "shipped",
    role: "lead engineer",
    tech: ["Next.js", "WebSockets", "Three.js", "Postgres"],
    featured: true,
    description: [
      "A realtime analytics dashboard with custom charts, WebSocket data feeds, and a 3D KPI scene built in React Three Fiber.",
      "Built on Next.js 15 with a custom WebSocket router. Charts rendered to canvas; the 3D scene is wired to the same state store so it never drifts from the numbers.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian" },
    ],
  },
  {
    slug: "voxel-portfolio",
    idx: "02",
    title: "Voxel Portfolio",
    tagline: "A walkable voxel world rendered with custom GLSL.",
    year: "2025",
    status: "live",
    role: "solo",
    tech: ["Three.js", "GLSL", "React"],
    featured: true,
    description: [
      "Immersive WebGL portfolio with a navigable voxel scene, custom shaders, and post-processing bloom.",
      "Built entirely in Three.js with custom GLSL shaders for the voxel rendering and ambient occlusion.",
    ],
    links: [],
  },
  {
    slug: "ai-notes",
    idx: "03",
    title: "AI Notes",
    tagline: "Local-first notes app with semantic search.",
    year: "2024",
    status: "open source",
    role: "solo",
    tech: ["TypeScript", "SQLite", "Embeddings"],
    featured: false,
    description: [
      "A notes app with semantic search powered by embeddings, fully local-first with sync, plus a slash-command palette.",
    ],
    links: [
      { label: "github", href: "https://github.com/Ismailravian" },
    ],
  },
];

// ── Live data from Supabase via Next.js API ───────────────────────────────
// Fetch once on load; update window variables so React re-renders.
async function loadLiveData() {
  try {
    const res = await fetch('/api/portfolio-data', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();

    if (data.profile) {
      Object.assign(window.__PROFILE, {
        name:       data.profile.name       || window.__PROFILE.name,
        headline:   data.profile.headline   || window.__PROFILE.headline,
        bio:        data.profile.bio        || window.__PROFILE.bio,
        email:      data.profile.email      || window.__PROFILE.email,
        location:   data.profile.location   || window.__PROFILE.location,
        github:     data.profile.github_url   ? data.profile.github_url.replace('https://', '') : window.__PROFILE.github,
        linkedin:   data.profile.linkedin_url ? data.profile.linkedin_url.replace('https://', '') : window.__PROFILE.linkedin,
        skills:     data.profile.skills?.map(s => ({ name: s, lvl: 'fluent' })) || window.__PROFILE.skills,
        experience: data.profile.experience?.map(e => ({
          when: e.end ? `${e.start} — ${e.end}` : `${e.start} — now`,
          role: e.role, org: e.company, desc: e.summary,
        })) || window.__PROFILE.experience,
      });
    }

    if (data.projects?.length) {
      window.__PROJECTS = data.projects.map((p, i) => ({
        slug:        p.slug,
        idx:         String(i + 1).padStart(2, '0'),
        title:       p.title,
        tagline:     p.tagline,
        year:        new Date(p.created_at).getFullYear().toString(),
        status:      p.featured ? 'featured' : 'shipped',
        role:        'engineer',
        tech:        p.tech || [],
        featured:    p.featured,
        description: p.description ? p.description.split('\n\n').filter(Boolean) : [p.tagline],
        links: [
          p.github_url  && { label: 'github',  href: p.github_url },
          p.vercel_url  && { label: 'vercel',  href: p.vercel_url },
          p.demo_url    && { label: 'demo',    href: p.demo_url },
          p.linkedin_url && { label: 'linkedin', href: p.linkedin_url },
        ].filter(Boolean),
      }));
    }

    // Signal app to re-render with fresh data
    window.dispatchEvent(new CustomEvent('portfolio-data-loaded'));
  } catch (e) {
    console.log('Live data unavailable, using defaults.');
  }
}

window.__PROFILE  = PROFILE;
window.__PROJECTS = PROJECTS;
loadLiveData();
