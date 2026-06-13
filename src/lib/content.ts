import fs from "fs";
import path from "path";
import type {
  BlogPost,
  Certification,
  EducationItem,
  ExperienceItem,
  ExpertiseGroup,
  Project,
  SiteContent,
} from "./types";

/**
 * Content loader — the engine of the content-driven system.
 *
 * Every project in /content/projects/*.json is discovered automatically at
 * build time. Adding a project requires NO code changes:
 *   1. add images to public/images/projects/<slug>/
 *   2. add content/projects/<slug>.json (copy _template.json)
 *   3. commit and push — GitHub Actions rebuilds and deploys.
 *
 * The filename (minus .json) is the slug and the URL: /projects/<slug>/.
 * Files starting with "_" (like _template.json) and files with
 * "published": false are skipped.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

const REQUIRED_PROJECT_FIELDS = [
  "title",
  "category",
  "summary",
  "problem",
  "solution",
  "impact",
  "techStack",
] as const;

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(
      `[content] ${path.basename(filePath)} is not valid JSON: ${(err as Error).message}`
    );
  }
}

function validateProject(data: Record<string, unknown>, file: string): void {
  const missing = REQUIRED_PROJECT_FIELDS.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === ""
  );
  if (missing.length > 0) {
    throw new Error(
      `[content] ${file} is missing required field(s): ${missing.join(", ")}. ` +
        `See content/projects/_template.json for the schema.`
    );
  }
  if (!Array.isArray(data.techStack)) {
    throw new Error(`[content] ${file}: "techStack" must be an array of strings.`);
  }
}

export function getSiteContent(): SiteContent {
  return readJson<SiteContent>(path.join(CONTENT_DIR, "site.json"));
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const projects: Project[] = [];

  for (const file of files) {
    const data = readJson<Record<string, unknown>>(path.join(PROJECTS_DIR, file));

    // Drafts are skipped entirely — set "published": true to go live.
    if (data.published === false) continue;

    validateProject(data, file);

    const slug = file.replace(/\.json$/, "");
    projects.push({
      ...(data as unknown as Omit<Project, "slug">),
      slug,
      featured: data.featured === true,
      published: true,
      order: typeof data.order === "number" ? data.order : 99,
    });
  }

  return projects.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getExperience(): ExperienceItem[] {
  return readJson<{ items: ExperienceItem[] }>(
    path.join(CONTENT_DIR, "experience.json")
  ).items;
}

export function getEducation(): EducationItem[] {
  return readJson<{ items: EducationItem[] }>(
    path.join(CONTENT_DIR, "education.json")
  ).items;
}

export function getCertifications(): Certification[] {
  return readJson<{ items: Certification[] }>(
    path.join(CONTENT_DIR, "certifications.json")
  ).items;
}

export function getExpertise(): ExpertiseGroup[] {
  return readJson<{ items: ExpertiseGroup[] }>(
    path.join(CONTENT_DIR, "expertise.json")
  ).items;
}

export interface BlogContent {
  publication?: string;
  publicationUrl?: string;
  posts: BlogPost[];
}

export function getBlog(): BlogContent {
  const data = readJson<{
    publication?: string;
    publicationUrl?: string;
    items: BlogPost[];
  }>(path.join(CONTENT_DIR, "blog.json"));
  // Newest first, regardless of file order.
  const posts = [...data.items].sort((a, b) => b.date.localeCompare(a.date));
  return {
    publication: data.publication,
    publicationUrl: data.publicationUrl,
    posts,
  };
}
