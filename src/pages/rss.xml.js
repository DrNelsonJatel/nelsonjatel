import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts.ts';

export async function GET(context) {
  const all = await getCollection('episodes');
  const episodes = all
    .filter((e) => !e.data.draft)
    .sort((a, b) => b.data.pubDate - a.data.pubDate);

  return rss({
    title: 'The Signal · Weak Ties · shorts',
    description: 'Weekly short videos on the hidden networks behind how decisions get made and how change happens, by Dr. Nelson Jatel.',
    site: context.site ?? SITE.url,
    items: episodes.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.pubDate,
      link: `/signals/${e.id}/`,
      categories: [e.data.category],
    })),
  });
}
