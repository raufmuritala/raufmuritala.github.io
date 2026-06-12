import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { SiteContent } from "@/lib/types";

export default function About({ site }: { site: SiteContent }) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="silver.about_me" title="About" />

      <div className="grid gap-12 md:grid-cols-[0.42fr_0.58fr] md:gap-16">
        <Reveal>
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-2xl border border-gold/25"
              aria-hidden="true"
            />
            <Image
              src={site.profileImage}
              alt={`Portrait of ${site.name}`}
              width={526}
              height={540}
              className="relative w-full rounded-xl border border-line object-cover grayscale-[15%]"
              priority={false}
            />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {site.focusAreas.map((area) => (
              <p
                key={area}
                className="rounded-md border border-line-soft bg-panel px-3 py-2 text-center font-mono text-[11px] text-muted"
              >
                {area}
              </p>
            ))}
          </div>
        </Reveal>

        <div>
          {site.about.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-5 leading-relaxed text-muted [&:first-of-type]:text-ink [&:first-of-type]:text-lg">
                {para}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <p className="mb-4 mt-10 font-mono text-xs tracking-widest text-gold/90">
              gold.tech_stack
            </p>
            <div className="flex flex-wrap gap-2">
              {site.techStack.map((t) => (
                <span
                  key={t.name}
                  className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
