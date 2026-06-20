// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://nelsonjatel.com',
  // Keep noindex utility pages out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/speaker-kit') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  // Static output; deploys to Vercel, Cloudflare Pages, or Netlify unchanged.
  output: 'static',
});
