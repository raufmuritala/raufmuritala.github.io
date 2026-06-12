"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import TechBadge from "./TechBadge";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-gold/40"
    >
      <Link
        href={`/projects/${project.slug}/`}
        className="absolute inset-0 z-10"
        aria-label={`Read the ${project.title} case study`}
      />

      {project.coverImage ? (
        <div className="relative aspect-[1200/630] overflow-hidden border-b border-line-soft">
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-widest text-gold/90 uppercase">
            {project.category}
          </p>
          {project.featured ? (
            <span className="rounded-full border border-gold/40 bg-gold-soft px-2 py-0.5 font-mono text-[10px] text-gold">
              featured
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-gold">
          {project.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        {project.metrics && project.metrics.length > 0 ? (
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line-soft pt-4">
            {project.metrics.slice(0, 2).map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-mono text-base text-gold">{m.value}</dd>
                <dd className="text-[11px] leading-snug text-faint">{m.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <TechBadge key={t} name={t} />
          ))}
          {project.techStack.length > 5 ? (
            <span className="px-1 py-1 font-mono text-xs text-faint">
              +{project.techStack.length - 5}
            </span>
          ) : null}
        </div>

        <p className="mt-6 font-mono text-xs text-muted transition-colors group-hover:text-gold">
          Read case study →
        </p>
      </div>
    </motion.article>
  );
}
