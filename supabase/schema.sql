-- Portfolio schema. Paste the whole file into the Supabase SQL editor and click Run.

create extension if not exists "pgcrypto";

-- =========================
-- projects
-- =========================
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  tagline      text not null,
  description  text not null,
  cover_url    text,
  video_url    text,
  demo_url     text,
  github_url   text,
  vercel_url   text,
  linkedin_url text,
  tech         text[] not null default '{}',
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Add columns to existing tables if re-running after initial setup
alter table public.projects add column if not exists vercel_url   text;
alter table public.projects add column if not exists linkedin_url text;

-- =========================
-- profile (singleton)
-- =========================
create table if not exists public.profile (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  headline      text not null,
  bio           text not null,
  avatar_url    text,
  location      text,
  email         text,
  phone         text,
  linkedin_url  text,
  github_url    text,
  resume_url    text,
  skills        text[] not null default '{}',
  experience    jsonb  not null default '[]'::jsonb,
  education     jsonb  not null default '[]'::jsonb,
  updated_at    timestamptz not null default now()
);

-- =========================
-- Row Level Security
-- =========================
alter table public.projects enable row level security;
alter table public.profile  enable row level security;

drop policy if exists "projects readable by anyone" on public.projects;
create policy "projects readable by anyone"
  on public.projects for select using (true);

drop policy if exists "profile readable by anyone" on public.profile;
create policy "profile readable by anyone"
  on public.profile for select using (true);

drop policy if exists "authed can write projects" on public.projects;
create policy "authed can write projects"
  on public.projects for all to authenticated
  using (true) with check (true);

drop policy if exists "authed can write profile" on public.profile;
create policy "authed can write profile"
  on public.profile for all to authenticated
  using (true) with check (true);

-- =========================
-- Seed (edit then run once — or skip and use the admin panel)
-- =========================
insert into public.profile (name, headline, bio, location, email, linkedin_url, github_url, skills, experience, education)
select
  'Ismail',
  'Software Engineer — building the web in 3D',
  'I design and ship modern web experiences with TypeScript, React, and a dash of WebGL.',
  'Earth',
  'ismailravian541@gmail.com',
  'https://www.linkedin.com/in/your-handle',
  'https://github.com/your-handle',
  ARRAY['TypeScript','React','Next.js','Three.js','Tailwind','Postgres'],
  '[{"company":"Acme Studio","role":"Frontend Engineer","start":"2024-01","end":null,"summary":"Built marketing sites and dashboards in Next.js with custom 3D scenes."}]'::jsonb,
  '[{"school":"Your University","degree":"B.Sc. Computer Science","start":"2020-09","end":"2024-06"}]'::jsonb
where not exists (select 1 from public.profile);

insert into public.projects (slug, title, tagline, description, tech, featured, sort_order)
values
  ('neon-dashboard','Neon Dashboard','Realtime analytics with WebSocket streams',
   'A realtime analytics dashboard with custom charts, WebSocket data feeds, and a 3D KPI scene.',
   ARRAY['Next.js','WebSockets','Three.js','Postgres'], true, 1),
  ('voxel-portfolio','Voxel Portfolio','An interactive voxel world you can walk through',
   'Immersive WebGL portfolio with a navigable voxel scene, custom shaders, and post-processing bloom.',
   ARRAY['Three.js','GLSL','React'], true, 2)
on conflict (slug) do nothing;
