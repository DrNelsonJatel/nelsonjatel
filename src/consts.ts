// Central site configuration. Edit these in one place.
// Items marked CONFIRM need a real value before launch; do not ship placeholders.
import { PUBLICATIONS } from './data/publications';
import { BOOKS } from './data/books';
import { TOOLS } from './data/tools';

export const SITE = {
  title: 'Dr. Nelson Jatel',
  wordmark: 'Dr. Nelson Jatel',
  descriptor: 'Water & Networks',
  url: 'https://nelsonjatel.com',
  email: 'hello@nelsonjatel.com',
  author: 'Dr. Nelson Jatel',
  locale: 'en_CA',
  description:
    'Keynote speaker and social network analyst. I help leaders map the hidden ' +
    'relationships behind their decisions, in water, in governance, and anywhere ' +
    'people and power connect.',
  ogImage: '/images/og-endcard.png',
} as const;

export const CLOSER = 'It all feels like noise, until you trace the signal.';

// Primary navigation. Books is intentionally omitted until a nonfiction title
// exists (no live placeholders). Add { href: '/books', label: 'Books' } then.
export const NAV = [
  { href: '/speaking', label: 'Speaking' },
  { href: '/signals', label: 'Signals in the Stream' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

// Nav with Books and Publications inserted (before About) only when they have
// content, so a tab never appears empty. Header and Footer both use this.
export function navItems(): { href: string; label: string }[] {
  const items: { href: string; label: string }[] = [...NAV];
  let at = 2; // insert before About
  if (TOOLS.length > 0) { items.splice(at++, 0, { href: '/tools', label: 'Tools' }); }
  if (BOOKS.length > 0) { items.splice(at++, 0, { href: '/books', label: 'Books' }); }
  if (PUBLICATIONS.length > 0) { items.splice(at++, 0, { href: '/publications', label: 'Publications' }); }
  return items;
}

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@Dr.NelsonJatel',
  linkedin: 'https://www.linkedin.com/in/nelsonjatel/',
} as const;

// Booking + contact forms insert into Supabase (table: enquiries), the same
// client-insert pattern as the Thresan site. Connection comes from env vars
// (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_KEY); see .env.example. RLS lets the
// public key insert only, never read. The submit handler lives in
// src/scripts/enquiry.ts.

// Newsletter ESP form action (Kit / Mailchimp / Squarespace Campaigns).
// Tie to the existing Freshwater Focus audience. CONFIRM; empty = form hidden.
export const NEWSLETTER_ACTION = '';

// Only render once it is a true, current number. Empty = line is hidden.
export const NEWSLETTER_PROOF = '';

// "Spoken at" bar. Verified names only; add logos later with permission.
export const PROOF_BAR: string[] = [
  'Canadian Water Resources Association · Winnipeg 2026',
  'UBC Okanagan',
  'Environmental Flows Conference',
];

// Testimonials render only if this array has entries (no fabricated quotes).
export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [];
