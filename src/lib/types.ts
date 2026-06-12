/**
 * Content type definitions.
 * These mirror the JSON files in /content — if you change a schema there,
 * update it here so the build catches mistakes.
 */

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectArchitecture {
  description: string;
  diagram?: string | null;
}

export interface Project {
  /** Derived from the filename, e.g. payvault-data-platform.json → payvault-data-platform */
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  architecture?: ProjectArchitecture | null;
  metrics?: ProjectMetric[];
  challenges?: string[];
  designDecisions?: string[];
  lessonsLearned?: string[];
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  date?: string;
  coverImage?: string | null;
  gallery?: string[];
}

export interface ExperienceItem {
  company: string;
  companyUrl?: string | null;
  role: string;
  type?: string;
  location?: string;
  start: string;
  end: string | null;
  summary?: string;
  highlights?: string[];
  skills?: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  detail?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  expires?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  skills?: string[];
}

export interface TechStackItem {
  name: string;
  group: string;
}

export interface SiteContent {
  name: string;
  role: string;
  headline: string;
  tagline: string;
  location: string;
  email: string;
  siteUrl: string;
  resumeUrl: string;
  profileImage: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  about: string[];
  focusAreas: string[];
  techStack: TechStackItem[];
}
