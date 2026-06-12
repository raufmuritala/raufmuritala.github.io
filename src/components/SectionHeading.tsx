import Reveal from "./Reveal";

/**
 * Section header with a mono "eyebrow" label — styled like a schema
 * qualifier (e.g. "gold.featured_projects") to carry the data-platform theme.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="font-mono text-xs tracking-widest text-gold/90 mb-3">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 max-w-2xl text-muted leading-relaxed">{intro}</p>
      ) : null}
    </Reveal>
  );
}
