export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover_url: string | null;
  video_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  vercel_url: string | null;
  linkedin_url: string | null;
  tech: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  resume_url: string | null;
  skills: string[];
  experience: Experience[];
  education: Education[];
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string | null;
  summary: string;
};

export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string | null;
  summary?: string;
};
