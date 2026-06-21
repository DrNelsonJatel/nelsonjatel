import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A shared `thread` slug links a monthly vlog to its companion newsletter
// edition and its child shorts, so the repurposing cluster interlinks itself
// (no hand-linking). Optional: a piece without a thread simply stands alone.
const thread = z.string().optional();

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
    thread,
    // Drafts never appear in the production build. Flip to false to publish.
    draft: z.boolean().default(false),
  }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletter' }),
  schema: z.object({
    // Issue number, used for ordering and the "Issue NN" label.
    issue: z.number(),
    title: z.string(),
    // One-line standfirst, also used as the meta description and list summary.
    dek: z.string(),
    pubDate: z.coerce.date(),
    thread,
    // Drafts never appear in the production build. Flip to false to publish.
    draft: z.boolean().default(false),
  }),
});

// The monthly vlog: the anchor video. Its page embeds the video and links the
// companion newsletter edition and child shorts via the shared thread.
const vlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vlog' }),
  schema: z.object({
    title: z.string(),
    // YouTube video ID (the part after watch?v=). Required to publish.
    youtube: z.string(),
    // One-line standfirst, also used as the meta description and list summary.
    dek: z.string(),
    pubDate: z.coerce.date(),
    thread,
    // Drafts never appear in the production build. Flip to false to publish.
    draft: z.boolean().default(false),
  }),
});

export const collections = { episodes, newsletter, vlog };
