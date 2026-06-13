import Reveal from "./Reveal";
import type { SiteContent } from "@/lib/types";

export default function Contact({ site }: { site: SiteContent }) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-panel px-6 py-14 text-center md:px-12 md:py-20">
          <div className="grid-texture absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <p className="font-mono text-xs tracking-widest text-gold/90">
              lets_build
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Let&apos;s build something.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Interested in data platforms, analytics engineering, or business
              intelligence initiatives? Let&apos;s connect.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                {site.email}
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-gold/60 hover:text-gold"
              >
                LinkedIn
              </a>
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-gold/60 hover:text-gold"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
