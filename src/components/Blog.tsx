import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { BlogPost } from "@/lib/types";

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * Writing — links out to the Substack publication. Content-driven: add a post
 * by appending one entry to content/blog.json (newest is sorted to the top).
 */
export default function Blog({
  posts,
  publication,
  publicationUrl,
}: {
  posts: BlogPost[];
  publication?: string;
  publicationUrl?: string;
}) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="border-y border-line-soft bg-panel/30">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="writing"
          title="From the blog"
          intro="Field notes on building data systems — modeling, pipelines, and the gap between spreadsheets and production analytics."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.url} delay={i * 0.06}>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-xl border border-line bg-panel p-6 transition-colors hover:border-gold/40"
              >
                <p className="font-mono text-[11px] tracking-widest text-faint uppercase">
                  {fmt.format(new Date(post.date))}
                  {publication ? ` · ${publication}` : ""}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-gold">
                  {post.title}
                </h3>
                {post.subtitle ? (
                  <p className="mt-2 flex-1 leading-relaxed text-muted">
                    {post.subtitle}
                  </p>
                ) : (
                  <span className="flex-1" />
                )}
                <span className="mt-4 font-mono text-xs text-gold">
                  Read on Substack ↗
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {publicationUrl ? (
          <Reveal delay={0.1}>
            <div className="mt-8">
              <a
                href={publicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold/60 hover:text-gold"
              >
                View all posts ↗
              </a>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
