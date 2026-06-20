// Central site configuration. Edit these in one place.
// Items marked CONFIRM need a real value before launch; do not ship placeholders.

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

export const SOCIAL = {
  // CONFIRM exact YouTube handle string before launch.
  youtube: 'https://www.youtube.com/@Dr.NelsonJatel',
  // CONFIRM LinkedIn URL, then it renders in the footer.
  linkedin: '',
} as const;

// Booking + contact forms post here. Static-host friendly: create a free
// Formspree (or Web3Forms) form and paste its endpoint. CONFIRM before launch.
export const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_FORM_ID';

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
