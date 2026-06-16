export interface HomeContent {
  id: string;
  greeting: string;
  name: string;
  tagline: string;
  roles: string[];
  avatar_url: string | null;
  resume_url: string | null;
  social_links: SocialLinks;
  updated_at: string;
}

export interface SocialLinks {
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
}

export interface AboutContent {
  id: string;
  bio_paragraphs: string[];
  photo_url: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  icon_url: string | null;
  category: "tech" | "tool";
  level: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued_date: string;
  description: string | null;
  image_url: string | null;
  credential_url: string | null;
  sort_order: number;
  created_at: string;
}
