import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { SiteContent } from "@/lib/types";

export default function About({ site }: { site: SiteContent }) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="about_me" title="About" />

      <div className="grid gap-10 md:grid-cols-[0.35fr_0.65fr] md:gap-16">
        <Reveal>
          {/* Portrait is intentionally secondary: small, desaturated, with a
              quiet design-system border so the written content leads. */}
          <Image
            src={site.profileImage}
            alt={`Portrait of ${site.name}`}
            width={526}
            height={540}
            className="w-full max-w-[140px] rounded-xl border border-line bg-transparent object-cover [filter:grayscale(0.35)_contrast(0.87)_saturate(0.9)] md:max-w-[240px]"
            priority={false}
          />
          <div className="mt-6 flex flex-col gap-2">
            {site.focusAreas.map((area) => (
              <p
                key={area}
                className="rounded-md border border-line-soft bg-panel px-3 py-2 font-mono text-[11px] text-muted"
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
              tech_stack
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
