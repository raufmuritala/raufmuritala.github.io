import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TechBadge from "./TechBadge";
import type { Certification } from "@/lib/types";

export default function Certifications({ items }: { items: Certification[] }) {
  return (
    <section
      id="certifications"
      className="border-y border-line-soft bg-panel/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="certifications" title="Certifications" />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <article className="flex h-full flex-col rounded-xl border border-line bg-panel p-6 transition-colors hover:border-gold/40">
                <p className="font-mono text-[11px] tracking-widest text-faint uppercase">
                  {c.issuer}
                </p>
                <h3 className="mt-2 flex-0 font-display text-lg font-semibold leading-snug text-ink">
                  {c.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-muted">
                  Issued {c.issued}
                  {c.expires ? ` · Expires ${c.expires}` : ""}
                </p>
                {c.credentialId ? (
                  <p className="mt-1 break-all font-mono text-[11px] text-faint">
                    ID {c.credentialId}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                  {(c.skills ?? []).map((s) => (
                    <TechBadge key={s} name={s} />
                  ))}
                </div>
                {c.credentialUrl ? (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 font-mono text-xs text-gold hover:underline"
                  >
                    Show credential ↗
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
