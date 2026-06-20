// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://nelsonjatel.com',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  // Static output; deploys to Vercel, Cloudflare Pages, or Netlify unchanged.
  output: 'static',
});
