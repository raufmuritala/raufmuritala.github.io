"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import PipelineGraphic from "./PipelineGraphic";
import type { SiteContent } from "@/lib/types";

export default function Hero({ site }: { site: SiteContent }) {
  const reduce = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="grid-texture absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-36 pb-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:pt-44 md:pb-28">
        <div>
          <motion.p
            {...enter(0)}
            className="mb-5 font-mono text-sm text-muted"
          >
            <span className="text-ink">{site.name}</span>
            <span className="text-gold"> · </span>
            {site.role}
          </motion.p>

          <motion.h1
            {...enter(0.1)}
            className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            Building scalable{" "}
            <span className="text-gold">data platforms</span> and analytics
            systems.
          </motion.h1>

          <motion.p
            {...enter(0.2)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {site.tagline}
          </motion.p>

          <motion.div {...enter(0.3)} className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/#projects"
              className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              View projects
            </Link>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold/60 hover:text-gold"
            >
              Download resume
            </a>
            <Link
              href="/#contact"
              className="rounded-md px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Contact me →
            </Link>
          </motion.div>

          <motion.p {...enter(0.4)} className="mt-10 font-mono text-xs text-faint">
            {site.location}
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
          className="rounded-2xl border border-line-soft bg-panel/60 p-5 md:p-7"
        >
          <p className="mb-4 font-mono text-[11px] tracking-widest text-faint">
            MEDALLION PIPELINE · LIVE FLOW
          </p>
          <PipelineGraphic />
        </motion.div>
      </div>
    </section>
  );
}
