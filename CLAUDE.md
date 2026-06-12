# CLAUDE.md — project context for Claude Code

This file is read automatically by Claude Code when working in this repository.

## What this is

Personal portfolio of Rauf Muritala (Data Engineer), live at https://raufmuritala.github.io.
Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, statically exported (`output: "export"`) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`/`master`.

## The one rule that matters most

**This is a content-driven site. Never hardcode portfolio content into components.**
All content lives in JSON under `content/`:

- `content/site.json` — name, headline, bio, tech stack, socials, email, siteUrl
- `content/projects/*.json` — one file per project; the filename is the URL slug (`/projects/<filename>/`). Auto-discovered by `src/lib/content.ts` at build time. `_template.json` is the schema reference; files starting with `_` or with `"published": false` are skipped. Required fields are validated at build — missing fields fail the build on purpose.
- `content/experience.json`, `content/education.json`, `content/certifications.json`

Adding a project must always remain: add images → add one JSON file → push. No code changes.

## Architecture map

- `src/lib/content.ts` — filesystem content loader + validation (server-side only)
- `src/lib/types.ts` — TypeScript schemas mirroring the JSON files
- `src/app/page.tsx` — homepage assembling section components
- `src/app/projects/[slug]/page.tsx` — case-study pages via `generateStaticParams` (+ `dynamicParams = false`)
- `src/app/sitemap.ts` — generated from content (`dynamic = "force-static"`)
- `src/components/` — UI; components using framer-motion or browser APIs are `"use client"`, pages stay server components and pass content down as props

## Design system

- Tokens are CSS variables in `src/app/globals.css` under `@theme` (Tailwind v4 — utilities like `text-gold`, `bg-panel` reference `var(--color-*)`).
- Theme: dark by default ("warehouse midnight"); light mode = `html.light` class overriding the same variables. Initial theme set pre-paint by an inline script in `layout.tsx` (localStorage `theme`, falls back to `prefers-color-scheme`). Toggle: `src/components/ThemeToggle.tsx`.
- Accent system: bronze → silver → gold (Medallion Architecture vocabulary). Fonts: Space Grotesk Variable (display), Inter Variable (body), JetBrains Mono Variable (labels/metrics) via @fontsource — self-hosted, do not switch to next/font/google (breaks offline builds).
- All animation must respect `prefers-reduced-motion`.

## Hard constraints (static export / GitHub Pages)

- No server features: no API routes, no SSR, no `next/image` optimization (`images.unoptimized: true`), no middleware.
- Keep `trailingSlash: true` and `public/.nojekyll`.
- New dynamic routes need `generateStaticParams`.
- `npm run build` must pass — it is exactly what CI runs. Always run it after changes.

## Conventions

- Eyebrow labels are lowercase mono snake_case without prefixes (e.g. `featured_projects`, not `gold.featured_projects`).
- Prefer editing JSON content over components when the request is about wording/data.
- SEO lives in `layout.tsx` (global + JSON-LD Person), `projects/[slug]/page.tsx` (per-project + TechArticle JSON-LD), `sitemap.ts`, `public/robots.txt`. If the domain ever changes, update `siteUrl` in `content/site.json` and the Sitemap line in `public/robots.txt`.
