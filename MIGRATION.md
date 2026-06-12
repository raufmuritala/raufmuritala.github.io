# Migration Plan: simplefolio → Next.js portfolio

This replaces the legacy Parcel/Bootstrap site (a `cobiwave/simplefolio` fork) with the new content-driven Next.js portfolio, while keeping the same repository and URL (`https://raufmuritala.github.io`).

> Heads up on a bug in the old setup: your previous `.github/workflows/deploy.yml` triggered on pushes to `main`, but the repo's default branch is `master` — so it never ran on push. The new workflow triggers on **both** branches, so this is fixed regardless of which branch you keep.

## Step 0 — Back up the old site (5 min)

```bash
git clone https://github.com/raufmuritala/raufmuritala.github.io
cd raufmuritala.github.io
git checkout -b legacy-simplefolio
git push origin legacy-simplefolio
git checkout master
```

The old site now lives forever on the `legacy-simplefolio` branch.

## Step 1 — Replace the repository contents

From the repo root on `master`:

```bash
# remove everything except .git
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

# copy in the new project (everything inside the delivered portfolio/ folder)
cp -r /path/to/portfolio/. .
```

Make sure hidden files came across: `.github/`, `.gitignore`, `.nvmrc`, `public/.nojekyll`.

## Step 2 — Verify your real assets

Your existing **resume** (`public/resume.pdf`) and **profile photo** (`public/images/profile.jpg`) were already migrated from the old repo into the new project. Replace them whenever you have newer versions.

Still placeholders — replace when ready (the site works fine with them meanwhile):

- `public/images/projects/<slug>/cover.png` — real screenshots/diagrams (1200×630 recommended)
- `public/images/projects/<slug>/architecture.png` — your real architecture diagrams
- `credentialUrl` values in `content/certifications.json` — your verification links from LinkedIn

## Step 3 — Test locally

```bash
npm install
npm run dev      # check http://localhost:3000
npm run build    # must succeed — this is exactly what CI runs
```

## Step 4 — Switch GitHub Pages to Actions (one-time)

Repo → **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

(The old site deployed from a `gh-pages` branch via the `gh-pages` npm package; that mechanism is retired.)

## Step 5 — Push and verify

```bash
git add -A
git commit -m "Rebuild portfolio: Next.js 15, content-driven projects, automated Pages deploy"
git push origin master
```

Watch the **Actions** tab — the "Deploy portfolio to GitHub Pages" workflow should go green, then check https://raufmuritala.github.io.

## Step 6 — Cleanup (optional)

- Delete the now-unused `gh-pages` branch: `git push origin --delete gh-pages`
- Optionally rename the default branch `master` → `main` (Settings → Branches). The workflow already supports both.
- Since the repo is a fork of simplefolio, GitHub may still label it "forked from cobiwave/simplefolio". You can ask GitHub Support to detach the fork, or ignore it — it has no functional effect.

## Rollback

If anything goes wrong: Settings → Pages → set Source back to "Deploy from a branch" → `gh-pages`, and the old site is back while you debug.
