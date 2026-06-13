import Reveal from "./Reveal";
import type { SiteContent } from "@/lib/types";

/**
 * Engineering Snapshot — a recruiter-scan credibility strip directly below the
 * hero. Big medallion-gold numbers carry the weight; the mono labels sit above
 * them as quiet qualifiers. Content is driven by `snapshot` in site.json.
 */
export default function Snapshot({ site }: { site: SiteContent }) {
  const snapshot = site.snapshot;
  if (!snapshot || snapshot.metrics.length === 0) return null;

  return (
    <section
      aria-label="Engineering snapshot"
      className="border-y border-line-soft bg-panel/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-14">
        <Reveal>
          <p className="mb-8 font-mono text-xs tracking-widest text-gold/90">
            engineering_snapshot
          </p>
        </Reveal>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {snapshot.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="flex h-full flex-col justify-between bg-panel px-5 py-6 md:px-6 md:py-7">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-faint">
                  {m.label}
                </dt>
                <dd className="mt-3 font-display text-4xl font-semibold tracking-tight text-gold md:text-5xl">
                  {m.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        {snapshot.caption ? (
          <Reveal delay={0.1}>
            <p className="mt-6 font-mono text-xs tracking-wide text-muted">
              {snapshot.caption}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
