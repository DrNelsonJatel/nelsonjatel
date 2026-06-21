import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, NEWSLETTER, NEWSLETTER_LOCKUP } from '../../consts.ts';

export async function GET(context) {
  const all = await getCollection('newsletter');
  const editions = all
    .filter((e) => !e.data.draft)
    .sort((a, b) => b.data.issue - a.data.issue);

  return rss({
    title: NEWSLETTER_LOCKUP,
    description: NEWSLETTER.prompt,
    site: context.site ?? SITE.url,
    items: editions.map((e) => ({
      title: `Issue ${e.data.issue}: ${e.data.title}`,
      description: e.data.dek,
      pubDate: e.data.pubDate,
      link: `/newsletter/${e.id}/`,
    })),
  });
}
