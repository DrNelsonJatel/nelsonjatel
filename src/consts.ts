// Central site configuration. Edit these in one place.
// Items marked CONFIRM need a real value before launch; do not ship placeholders.
import { BOOKS } from './data/books';

export const SITE = {
  title: 'Dr. Nelson Jatel',
  wordmark: 'Dr. Nelson Jatel',
  // Channel descriptor. Kept as a single constant so it swaps in one place.
  descriptor: 'Social Networks, Change & Decisions',
  url: 'https://nelsonjatel.com',
  email: 'hello@nelsonjatel.com',
  author: 'Dr. Nelson Jatel',
  locale: 'en_CA',
  description:
    'Keynote speaker and social network analyst. I trace how decisions actually ' +
    'get made and how change really happens, through the hidden networks behind ' +
    'them. Drawn from twenty years of mapping real networks.',
  ogImage: '/images/og-endcard.png',
} as const;

export const CLOSER = 'It all feels like noise, until you trace the signal.';

// Primary navigation. Books is intentionally omitted until a nonfiction title
// exists (no live placeholders). Add { href: '/books', label: 'Books' } then.
export const NAV = [
  { href: '/speaking', label: 'Speaking' },
  { href: '/newsletter', label: 'The Signal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

// Nav with Books and Publications inserted (before About) only when they have
// content, so a tab never appears empty. Header and Footer both use this.
export function navItems(): { href: string; label: string }[] {
  const items: { href: string; label: string }[] = [...NAV];
  // Books stays in the primary nav; Tools and Publications are tucked under About
  // (still live, indexed, and linked from About + the footer).
  if (BOOKS.length > 0) { items.splice(2, 0, { href: '/books', label: 'Books' }); }
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

// The Signal · Weak Ties: the monthly publication (newsletter + vlog) on the
// hidden networks behind how we decide and how we change. Native build on
// Supabase (subscribers, double opt-in) + Kit (delivery/automations; Resend
// fallback), with a web archive under /newsletter.
export const NEWSLETTER = {
  name: 'The Signal',
  series: 'Weak Ties', // masthead lockup: "The Signal · Weak Ties"
  prompt: 'One idea a month on the hidden networks behind how we decide and how we change. Traced in full, no noise.',
  // Flip to true once the double opt-in backend is live; gates the signup form.
  enabled: true,
} as const;

// Masthead lockup for the publication, used wherever the brand is shown.
export const NEWSLETTER_LOCKUP = `${NEWSLETTER.name} · ${NEWSLETTER.series}`;

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

// Speaker reel: a YouTube video ID (the part after watch?v=). Empty hides the reel.
export const SPEAKER_REEL = '';
