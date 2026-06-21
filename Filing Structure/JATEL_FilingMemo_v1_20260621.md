# Filing Framework Memo for Claude Code (cc)

**For:** cc
**Date:** 21 June 2026
**Companion to:** `CONTENT_BRIEF.md`, `JATEL_DevBrief_v1`, and the content workspace scaffold (`setup-content-workspace.sh`).
**Purpose:** one consistent filing framework across the production workspace and the repo, so content flows predictably from draft to publish and every piece of a monthly idea stays joined.

## 1. Two tiers, one framework

- **Production workspace** (in OneDrive, not git): `nelson/projects/nelsonjatel`. Pre-production only: scripts, drafts, raw media, exports, research. Organised edition-first as `03-editions/<YYYY-MM>_<slug>/`.
- **Repo** (git, not OneDrive): `nelsonjatel.com` (Astro). The canonical published content, under `src/content/...`.
- cc works in the repo. Do not read from or write to the OneDrive workspace; finished content arrives as markdown (pasted, or from the workspace `04-ready-to-publish`) for cc to file into the repo.
- Never place the repo inside OneDrive. Git plus cloud sync corrupts `.git`.

## 2. The join key: slug plus thread

Every monthly idea has one **slug** in kebab-case, for example `signal-vs-noise`. The workspace edition folder is `<YYYY-MM>_<slug>`; the repo files for that idea reuse the same `<slug>` and carry a `thread` front-matter field equal to the slug. The `thread` field is what links a vlog, its newsletter edition, and its shorts across the repo. Resolve all cross-links by `thread`, never by hand.

## 3. Repo filing conventions (cc owns these)

**Newsletter**
- Path: `src/content/newsletter/<slug>.md`
- Front matter: `issue` (int), `title`, `dek`, `pubDate` (ISO), `draft` (bool), `thread` (= slug)
- Publish by setting `draft: false`. Route: `/newsletter/<slug>`

**Episodes (weekly shorts)**
- Path: `src/content/episodes/<slug>-NN.md` where NN is the short's number within the thread
- Fields: `youtubeId`, `title`, `pubDate`, `transcript`, `thread` (= slug)
- Route: `/signals`; the per-episode page renders the full transcript as page text

**Vlog (monthly anchor, pending the collection decision)**
- If a `vlog` collection is adopted: `src/content/vlog/<slug>.md`
- Fields: `youtubeId`, `title`, `dek`, `pubDate`, `summary`, `thread` (= slug), `newsletter` (slug reference)
- Route: `/vlog/<slug>`

## 4. Slug rules

- kebab-case, lowercase, descriptive, no dates (the date lives in `pubDate` and the workspace folder name).
- Examples: `signal-vs-noise`, `drought-misinformation-network`, `org-chart-is-not-the-network`.
- A published slug is permanent. It is the URL and the join key, so if a title changes later, keep the slug.

## 5. Assets and OG

- Per-piece social images: `public/og/<slug>.png`, reusing the end-card system; or generate per edition.
- Production working copies of brand assets live in the workspace `01-brand-kit`, not the repo. The repo keeps only the assets it ships.

## 6. Naming: repo files versus deliverable documents

- **Repo source and content files use functional, required names** (`src/content/newsletter/signal-vs-noise.md`, `scripts/lint-content.mjs`). Do not apply the `JATEL_DocType_Version_YYYYMMDD` convention to repo files; it would break routes and imports.
- **Standalone deliverable documents** handed to Nelson (briefs, guides, exports) use his convention: `PROJECT_DocType_Version_YYYYMMDD.ext`, for example `JATEL_DevBrief_v1_20260620.md`.

## 7. Promotion flow (draft to publish)

1. A finished newsletter draft arrives (from the workspace edition `newsletter/draft.md`, or pasted).
2. cc files it at `src/content/newsletter/<slug>.md` with complete front matter and `thread` = slug.
3. cc adds the thread's shorts under `src/content/episodes/` with `youtubeId` and `transcript`.
4. cc adds the vlog entry (once that collection exists).
5. Set `draft: false` to publish; verify the route, the archive, the sitemap, the RSS feed, and the OG image.
6. `scripts/lint-content.mjs` must pass; it gates the build.

## 8. House rules (enforced at build)

Canadian spelling; no em dashes or double hyphens; no "Water Doc"; no BarrierFlow in this brand's content; no placeholders; end substantial pieces with the closer line, "It all feels like noise, until you trace the signal." These are enforced by `scripts/lint-content.mjs`, so non-conforming content cannot ship.

## 9. Setup instructions

**A. Production workspace (Nelson, once).** Run `setup-content-workspace.sh`, targeting the OneDrive-synced path, then symlink to the preferred working path:
```
bash setup-content-workspace.sh ~/Library/CloudStorage/OneDrive-Personal/projects/nelsonjatel
ln -s ~/Library/CloudStorage/OneDrive-Personal/projects/nelsonjatel ~/nelson/projects/nelsonjatel
```

**B. Repo (cc, verify or create).**
- Ensure the `newsletter`, `episodes`, and (if adopted) `vlog` content collections exist with the schemas in section 3, each including a `thread` field.
- Ensure `scripts/lint-content.mjs` is wired into the build (`"build": "npm run lint:content && astro build"`) and the Vercel build command is `npm run build`.
- Ensure `/newsletter`, `/signals`, and `/vlog` routes, archives, the sitemap, and the newsletter RSS feed exist (per DevBrief sections 2 and 6).

**C. Separation.** Repo outside OneDrive; media workspace inside OneDrive.

## 10. Out of scope and firewall

- *Freshwater Focus* stays a LinkedIn product, on a separate subscriber list. Do not cross-wire it.
- BarrierFlow stays out of this brand's content and repo entirely.

---

*Do-now versus blocked:* cc can verify and align the collection schemas (add `thread`), confirm the slug and OG conventions, and confirm the promotion flow against the lint gate immediately. Blocked on Nelson: the vlog-collection decision (section 3) and the open questions in DevBrief section 9.
