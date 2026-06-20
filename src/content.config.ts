import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string(),
    episode: z.number(),
    category: z.enum(['Governance', 'Water', 'Methods']),
    // YouTube video ID (the part after watch?v=). Required to publish.
    youtube: z.string(),
    // 80 to 150 word write-up, used on cards and as the meta description.
    summary: z.string(),
    pubDate: z.coerce.date(),
    // Drafts never appear in the production build. Flip to false to publish.
    draft: z.boolean().default(false),
  }),
});

export const collections = { episodes };
