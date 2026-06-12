# raufmuritala.github.io — Data Engineering Portfolio

Personal portfolio of **Rauf Muritala**, Data Engineer. Built as a content-driven static site: projects, experience, and certifications all live in JSON files — **no code changes are ever needed to add or edit content.**

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · static export · GitHub Pages.

---

## ⚡ Add a new project (the 3-step workflow)

1. **Add images** to `public/images/projects/<your-slug>/`
   - `cover.png` — 1200×630 recommended (also used for social previews)
   - `architecture.png` — your architecture diagram (optional)
   - any gallery screenshots (optional)

2. **Add one JSON file**: copy `content/projects/_template.json` to
   `content/projects/<your-slug>.json` and fill it in.
   The **filename becomes the URL**: `my-pipeline.json` → `/projects/my-pipeline/`.

3. **Commit and push.** GitHub Actions rebuilds and deploys automatically.

That's it. The homepage grid, the case-study page, the sitemap, and the page metadata are all generated from the JSON file.

### Project file rules

- Files starting with `_` are ignored (that's why `_template.json` doesn't render).
- `"published": false` keeps a project as a hidden draft.
- `"featured": true` shows a "featured" badge on the card.
- `"order"` controls sort position (lower = first).
- Required fields: `title`, `category`, `summary`, `problem`, `solution`, `impact`, `techStack`. If one is missing or the JSON is malformed, **the build fails with an error naming the file** — a broken project can never silently break the live site.
- Optional case-study fields: `architecture`, `metrics`, `challenges`, `designDecisions`, `lessonsLearned`, `gallery`, `githubUrl`, `liveUrl`. Empty/omitted sections simply don't render.

## ✏️ Edit everything else

| What | File |
|---|---|
| Name, headline, bio, tech stack, socials, email | `content/site.json` |
| Experience timeline | `content/experience.json` |
| Education | `content/education.json` |
| Certification cards | `content/certifications.json` |
| Resume | replace `public/resume.pdf` |
| Profile photo | replace `public/images/profile.jpg` |

> **To do:** add your real credential verification URLs in `content/certifications.json` (`credentialUrl`) so the "Show credential" buttons appear, and replace the generated placeholder cover/architecture images with real screenshots and diagrams.

## 🛠 Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out (exactly what Pages serves)
```

Node 20+ (see `.nvmrc`).

## 🏗 How it works

```
content/
  site.json               ← identity, bio, skills
  experience.json         ← timeline
  education.json
  certifications.json
  projects/               ← ★ one JSON per project, auto-discovered
    _template.json        ← copy me
    payvault-data-platform.json
    ...
src/
  lib/content.ts          ← reads + validates all content at build time
  lib/types.ts            ← TypeScript schemas for the content files
  app/page.tsx            ← homepage (hero, about, projects, experience, certs, contact)
  app/projects/[slug]/    ← case-study pages via generateStaticParams
  app/sitemap.ts          ← generated from content
  components/             ← UI components
public/
  images/projects/<slug>/ ← project images
  resume.pdf, robots.txt, .nojekyll
.github/workflows/deploy.yml  ← build + deploy on every push
```

`src/lib/content.ts` scans `content/projects/` with the filesystem at build time, validates every file, and feeds the result to the homepage, the `[slug]` routes, the sitemap, and per-page SEO metadata.

## 🚀 Deployment

Every push to `master` or `main` triggers `.github/workflows/deploy.yml`, which builds the static export and publishes `./out` to GitHub Pages.

**One-time repo setting:** Settings → Pages → Source → **GitHub Actions**.

## 🎨 Design notes

The visual system is built on the **Medallion Architecture** vocabulary used in the projects themselves: bronze → silver → gold accents, section labels styled like schema qualifiers (`gold.featured_projects`), and an animated pipeline DAG in the hero. Tokens live in `src/app/globals.css`. Animations respect `prefers-reduced-motion`.
