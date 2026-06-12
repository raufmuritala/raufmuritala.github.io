import type { SiteContent } from "@/lib/types";

export default function Footer({ site }: { site: SiteContent }) {
  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {site.name} · built from{" "}
          <span className="text-bronze">bronze</span> →{" "}
          <span className="text-silver">silver</span> →{" "}
          <span className="text-gold">gold</span>
        </p>
        <nav className="flex gap-5" aria-label="Social links">
          <a href={site.social.github} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-gold transition-colors">
            GitHub
          </a>
          <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-gold transition-colors">
            LinkedIn
          </a>
          {site.social.twitter ? (
            <a href={site.social.twitter} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-gold transition-colors">
              X / Twitter
            </a>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}
