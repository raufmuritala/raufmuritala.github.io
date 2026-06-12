import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TechBadge from "@/components/TechBadge";
import { getAllProjects, getProjectBySlug, getSiteContent } from "@/lib/content";

/**
 * Case-study pages are generated automatically for every JSON file in
 * content/projects/ — no code changes needed to add a project.
 */
export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const site = getSiteContent();
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `${site.siteUrl}/projects/${project.slug}/`,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

function CaseSection({
  layer,
  title,
  children,
}: {
  layer: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mb-14">
      <p className="mb-2 font-mono text-xs tracking-widest text-gold/90">{layer}</p>
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-muted">
          <span
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const site = getSiteContent();
  if (!project) notFound();

  const all = getAllProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.summary,
    author: { "@type": "Person", name: site.name, url: site.siteUrl },
    url: `${site.siteUrl}/projects/${project.slug}/`,
    image: project.coverImage ? `${site.siteUrl}${project.coverImage}` : undefined,
    keywords: project.techStack.join(", "),
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="mx-auto max-w-4xl px-5 pt-32 pb-20 md:px-8 md:pt-40">
        {/* ---- header ---- */}
        <Reveal>
          <Link
            href="/#projects"
            className="font-mono text-xs text-muted transition-colors hover:text-gold"
          >
            ← all projects
          </Link>
          <p className="mt-8 font-mono text-xs tracking-widest text-gold/90 uppercase">
            {project.category}
            {project.date ? ` · ${project.date}` : ""}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-[2.6rem]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-gold/60 hover:text-gold"
              >
                View on GitHub ↗
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                Live demo ↗
              </a>
            ) : null}
          </div>
        </Reveal>

        {/* ---- metrics strip ---- */}
        {project.metrics && project.metrics.length > 0 ? (
          <Reveal className="mt-12">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-panel p-5">
                  <dd className="font-mono text-xl text-gold md:text-2xl">{m.value}</dd>
                  <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {/* ---- cover ---- */}
        {project.coverImage ? (
          <Reveal className="mt-12">
            <Image
              src={project.coverImage}
              alt={`${project.title} overview`}
              width={1200}
              height={630}
              className="w-full rounded-xl border border-line"
              priority
            />
          </Reveal>
        ) : null}

        <div className="mt-16">
          <CaseSection layer="bronze.problem" title="The problem">
            <p className="leading-relaxed text-muted">{project.problem}</p>
          </CaseSection>

          <CaseSection layer="silver.solution" title="The solution">
            <p className="leading-relaxed text-muted">{project.solution}</p>
          </CaseSection>

          {project.architecture ? (
            <CaseSection layer="silver.architecture" title="Architecture">
              <p className="leading-relaxed text-muted">
                {project.architecture.description}
              </p>
              {project.architecture.diagram ? (
                <Image
                  src={project.architecture.diagram}
                  alt={`${project.title} architecture diagram`}
                  width={1200}
                  height={630}
                  className="mt-6 w-full rounded-xl border border-line bg-panel"
                />
              ) : null}
            </CaseSection>
          ) : null}

          <CaseSection layer="gold.impact" title="Business impact">
            <p className="leading-relaxed text-muted">{project.impact}</p>
          </CaseSection>

          {project.challenges && project.challenges.length > 0 ? (
            <CaseSection layer="log.challenges" title="Challenges">
              <BulletList items={project.challenges} />
            </CaseSection>
          ) : null}

          {project.designDecisions && project.designDecisions.length > 0 ? (
            <CaseSection layer="log.design_decisions" title="Design decisions">
              <BulletList items={project.designDecisions} />
            </CaseSection>
          ) : null}

          {project.lessonsLearned && project.lessonsLearned.length > 0 ? (
            <CaseSection layer="log.lessons_learned" title="Lessons learned">
              <BulletList items={project.lessonsLearned} />
            </CaseSection>
          ) : null}

          {project.gallery && project.gallery.length > 0 ? (
            <CaseSection layer="assets.gallery" title="Gallery">
              <div className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${project.title} screenshot`}
                    width={800}
                    height={500}
                    className="w-full rounded-lg border border-line"
                  />
                ))}
              </div>
            </CaseSection>
          ) : null}

          <Reveal>
            <p className="mb-3 font-mono text-xs tracking-widest text-gold/90">
              meta.tech_stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <TechBadge key={t} name={t} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---- next project ---- */}
        {all.length > 1 ? (
          <Reveal className="mt-20">
            <Link
              href={`/projects/${next.slug}/`}
              className="group block rounded-xl border border-line bg-panel p-6 transition-colors hover:border-gold/40"
            >
              <p className="font-mono text-xs text-muted">next case study →</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-gold">
                {next.title}
              </p>
            </Link>
          </Reveal>
        ) : null}
      </main>
      <Footer site={site} />
    </>
  );
}
