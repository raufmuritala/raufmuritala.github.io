import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import TechBadge from "./TechBadge";
import type { EducationItem, ExperienceItem } from "@/lib/types";

export default function Experience({
  items,
  education,
}: {
  items: ExperienceItem[];
  education: EducationItem[];
}) {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="experience" title="Experience" />

      <ol className="relative ml-2 border-l border-line pl-8 md:ml-4 md:pl-12">
        {items.map((job, i) => (
          <li key={`${job.company}-${job.role}`} className="relative pb-12 last:pb-0">
            <span
              className={`absolute -left-[41px] top-1.5 h-3.5 w-3.5 rounded-full border-2 md:-left-[57px] ${
                job.end === null
                  ? "border-gold bg-gold/30"
                  : "border-silver/60 bg-panel"
              }`}
              aria-hidden="true"
            />
            <Reveal delay={i * 0.05}>
              <p className="font-mono text-xs text-muted">
                {job.start} — {job.end ?? <span className="text-gold">Present</span>}
                {job.type ? <span className="text-faint"> · {job.type}</span> : null}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {job.role}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {job.companyUrl ? (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-silver hover:text-gold transition-colors"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-silver">{job.company}</span>
                )}
                {job.location ? <span className="text-faint"> · {job.location}</span> : null}
              </p>
              {job.summary ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {job.summary}
                </p>
              ) : null}
              {job.highlights && job.highlights.length > 0 ? (
                <ul className="mt-3 max-w-2xl space-y-1.5">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
              {job.skills && job.skills.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <TechBadge key={s} name={s} />
                  ))}
                </div>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>

      {education.length > 0 ? (
        <Reveal className="mt-16">
          <p className="mb-4 font-mono text-xs tracking-widest text-gold/90">
            education
          </p>
          {education.map((e) => (
            <div
              key={e.institution}
              className="max-w-2xl rounded-xl border border-line bg-panel p-5"
            >
              <p className="font-display font-semibold text-ink">{e.institution}</p>
              <p className="mt-1 text-sm text-muted">
                {e.degree} · {e.year}
              </p>
              {e.detail ? (
                <p className="mt-2 text-sm leading-relaxed text-faint">{e.detail}</p>
              ) : null}
            </div>
          ))}
        </Reveal>
      ) : null}
    </section>
  );
}
