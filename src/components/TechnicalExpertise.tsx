import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { ExpertiseGroup } from "@/lib/types";

/**
 * Technical Expertise — grouped capability cards (no proficiency bars or
 * percentages, on purpose). Each card is a domain with the concrete tools
 * used in it. Content is driven by content/expertise.json.
 */
export default function TechnicalExpertise({
  groups,
}: {
  groups: ExpertiseGroup[];
}) {
  if (!groups || groups.length === 0) return null;

  return (
    <section id="expertise" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="technical_expertise"
        title="Technical expertise"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06}>
            <article className="flex h-full flex-col rounded-xl border border-line bg-panel p-6 transition-colors hover:border-gold/40">
              <h3 className="font-display text-lg font-semibold text-ink">
                {g.group}
              </h3>
              {g.note ? (
                <p className="mt-1 font-mono text-[11px] tracking-widest text-faint">
                  {g.note}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line-soft bg-panel-2 px-3 py-1.5 font-mono text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
