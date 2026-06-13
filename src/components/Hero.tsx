"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";

/** Typewriter that cycles role titles. Static (no typing) under reduced motion. */
function RoleRotator({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(roles[0] ?? "");

  useEffect(() => {
    if (reduce || roles.length < 2) return;
    let roleIdx = 0;
    let charIdx = roles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = roles[roleIdx];
      if (deleting) {
        charIdx -= 1;
        setText(current.slice(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timer = setTimeout(tick, 260);
          return;
        }
        timer = setTimeout(tick, 42);
      } else {
        charIdx += 1;
        setText(current.slice(0, charIdx));
        if (charIdx >= current.length) {
          deleting = true;
          timer = setTimeout(tick, 1700);
          return;
        }
        timer = setTimeout(tick, 75);
      }
    };

    timer = setTimeout(tick, 1700);
    return () => clearTimeout(timer);
  }, [reduce, roles]);

  return (
    <span className="font-display text-2xl font-medium text-silver sm:text-3xl">
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true">{text}</span>
      <span aria-hidden="true" className="type-cursor text-gold">
        |
      </span>
    </span>
  );
}

export default function Hero({ site }: { site: SiteContent }) {
  const reduce = useReducedMotion();
  const roles = site.roles?.length ? site.roles : [site.role];
  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="grid-texture absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-20">
        <div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14">
          {/* ---- identity + positioning ---- */}
          <div>
            <motion.div {...enter(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3.5 py-1.5 font-mono text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                Data Engineering · Analytics · BI
              </span>
            </motion.div>

            <motion.h1
              {...enter(0.08)}
              className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem]"
            >
              Hey, I&apos;m <span className="text-gold">{site.name.split(" ")[0]}</span>
            </motion.h1>

            <motion.p {...enter(0.16)} className="mt-3 min-h-[2.5rem]">
              <RoleRotator roles={roles} />
            </motion.p>

            <motion.p
              {...enter(0.24)}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            >
              {site.tagline}
            </motion.p>

            <motion.div {...enter(0.32)} className="mt-8 flex flex-wrap gap-3">
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
                Get in touch →
              </Link>
            </motion.div>

            <motion.div {...enter(0.4)} className="mt-7 flex items-center gap-4">
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-muted transition-colors hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.26 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                </svg>
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-muted transition-colors hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
                </svg>
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email"
                className="text-muted transition-colors hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3.5 6.5l8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* ---- portrait ---- */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
            className="relative mx-auto w-full max-w-[360px] md:mx-0 md:ml-auto"
          >
            <div className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-gradient-to-br from-gold/15 via-transparent to-bronze/10 blur-xl" aria-hidden="true" />
            <Image
              src={site.profileImage}
              alt={`Portrait of ${site.name}`}
              width={526}
              height={540}
              priority
              className="w-full rounded-2xl border border-line-soft object-cover [filter:contrast(0.95)_saturate(0.95)]"
            />
            <span className="absolute -top-3 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg/90 px-3 py-1.5 font-mono text-[11px] text-ink shadow-lg backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Open to opportunities
            </span>
            <span className="absolute -bottom-3 left-4 inline-flex items-center gap-2 rounded-md border border-line bg-bg/90 px-3 py-1.5 font-mono text-[11px] text-muted shadow-lg backdrop-blur">
              <span className="text-gold">{">"}_</span>
              dbt build --select gold
            </span>
          </motion.div>
        </div>

        {/* ---- tech strip ---- */}
        <motion.div {...enter(0.48)} className="mt-14 border-t border-line-soft pt-7">
          <p className="mb-3 font-mono text-[11px] tracking-widest text-faint">stack</p>
          <div className="flex flex-wrap gap-2">
            {site.techStack.map((t) => (
              <span
                key={t.name}
                className="rounded-md border border-line bg-panel/60 px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                {t.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
