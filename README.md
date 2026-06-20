# nelsonjatel.com

Personal site for Dr. Nelson Jatel · Water & Networks. Keynote speaking, the
*Signals in the Stream* short-form series, and research credibility, built on the
"Hydrographic Signal" design system.

## Stack

- [Astro](https://astro.build) static site (`output: 'static'`)
- Self-hosted fonts (Instrument Serif, Instrument Sans, IBM Plex Mono)
- Episodes as a content collection (`src/content/episodes/`), one markdown file
  per episode with an embedded video and full transcript
- Sitemap + RSS + per-episode `VideoObject` / site-wide `Person` structured data

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the build locally
```

## Configure before launch

Edit `src/consts.ts`:

- `FORM_ENDPOINT` — Formspree / Web3Forms endpoint for the booking + contact forms
- `NEWSLETTER_ACTION` — email provider form action (empty hides the signup)
- `SOCIAL` — YouTube and LinkedIn URLs

Episodes ship as drafts (`draft: true`) and stay hidden in production until you
add the real `youtube` ID and transcript, then flip `draft: false`.

## Deploy

Static build deploys to Vercel, Cloudflare Pages, or Netlify unchanged.
Production target: `https://nelsonjatel.com` (set in `astro.config.mjs`).
