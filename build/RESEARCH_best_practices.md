# Best-practice research: speaker-first, video-feed personal sites

Compiled 2026-06-19 for nelsonjatel.com. Survey of ~20 speaker and creator-feed
sites plus authoritative conversion/marketing sources. This is the reference; the
changes it drove are folded into COPY_DECK.md, custom.css, and BUILD_CHECKLIST.md
(see "Applied" at the end).

## Exemplars worth studying

**Closest aesthetic and model matches for Nelson:**
- **Zack Kass** (zackkass.com) — dark/earthen palette, video above the fold, one
  message. Proves dark + minimal converts for a speaker.
- **Cleo Abram** (cleoabram.com) — short-form explainer creator who grew video into
  newsletter + podcast. The "Signals in the Stream" trajectory.
- **Marie Forleo** (marieforleo.com) — an entire personal brand built around a
  recurring video series (MarieTV) plus newsletter. Direct structural analogue.
- **Ann Handley** (annhandley.com) — the clearest nav blueprint: Writing/Speaking/
  About/Newsletter, with newsletter signup as a primary CTA and named-reader proof.
- **Brené Brown** (brenebrown.com) — the researcher-who-speaks credibility pattern;
  testimonials praise turning rigorous research into actionable insight.

**Speaker-conversion references:** Mel Robbins (high-contrast CTA, newsletter
funnel), Tony Robbins ("Book Tony" + "Watch the Reel" dual hero CTA), Neen James
(strong multi-page EPK), Simon Sinek / John Maxwell / Adam Grant / Amy Cuddy
(thought-leader content hubs), Tima Deryan (single signature hero image).

**Creator-hub references:** Ali Abdaal (audience segmentation), Tim Ferriss
(minimal, lead-magnet driven), MKBHD / Johnny Harris / Hank Green (video-first
hubs; several on clean Squarespace-style layouts with embedded reels + newsletter).

Roundups for live layout reference: SpeakerFlow "25 speaker websites", Colorlib 21,
Alliance Interactive 31, Feather and Sugar Pixels personal-brand collections.

## Best practices, condensed

**Homepage / hero**
- Lead with one ownable phrase (your IP), not a generic tagline.
- Exactly two CTAs in the hero: one booking action + one proof action. Not seven.
- Put visual social proof in or just below the hero (a logo bar or one quote) to
  answer the bureau's first question before they scroll.
- A soundless looping sizzle reel as hero is repeatedly cited; a single bold
  signature graphic serves the same role (your traced-signal SVG).

**Speaker page / booking**
- CTA names the action: "Invite Nelson to speak", not "Contact".
- Repeat the booking CTA down the page; put it in a sticky header.
- Speaker menu: 2 to 4 signature talks, each with the outcome it delivers.
- List formats explicitly (keynote / workshop / panel); planners book by format.
- Desaturated client/conference logo bar = experience + price-tier signal.
- Lead with your 2 to 3 strongest attributable testimonials; place a CTA right
  after them (trust, then ask).
- Offer an EPK both as a downloadable one-page PDF and an on-page section.
- Fees: most speakers do not publish a number. State that fees vary and invite a
  quote, which preserves negotiating room.

**Video archive (the SEO engine)**
- One page per episode: embedded player (not just a YouTube link), keyword-rich
  title, a write-up, and the full transcript. This is the biggest SEO lever.
- A 45 to 90s short won't yield much text, so the write-up + transcript should add
  ~300 to 800 words of context per page.
- Archive index needs categories + search/filter; each episode independently
  shareable; internal links between episodes and out to talks/books.
- Anti-pattern to avoid: an embedded video with only a one-line caption.

**Newsletter**
- Above-the-fold signup, repeated at the end of every episode and in the footer.
- One line of expectation: cadence + content + "no noise".
- Dated/named subscriber proof near the form (only once it is true).
- Minimum fields, ideally just email. Use popups sparingly so they don't fight a
  minimal aesthetic; prefer inline editorial forms.

**About / credibility**
- Lead the bio with research credentials and publications; for a researcher this
  is the authority that drives bookings.
- Offer the bio in three lengths (one line, 50 words, 150 words) for organisers.

**Forms**
- 3 to 5 fields. Completions drop ~25% past the fifth field; a single dropdown can
  roughly halve conversions. Visible labels (not placeholder-only), real-time
  validation, no booking maze.

**SEO, accessibility, performance**
- Semantic HTML, heading hierarchy, alt text, descriptive links: ranking inputs
  that overlap with accessibility.
- Captions on every short (80% of caption users watch on mute), keyboard-accessible
  player, transcripts.
- Dark themes: test body text for >= 4.5:1 contrast. Low-contrast grey-on-black is
  the classic editorial trap and the one place this aesthetic can fail AA.

## Aesthetic-vs-conversion tensions (and how we resolve them)
- Loud high-contrast CTA buttons and popups clash with minimalism -> use restrained
  mono-label buttons and inline forms.
- Logo bars -> desaturate to muted monochrome.
- Dark body-text contrast -> test against WCAG AA explicitly before launch.

## Applied to the build (2026-06-19)
- COPY_DECK: booking form trimmed to 5 fields, dropdown removed; fee "request a
  quote" line added; EPK as PDF + on-page section; three bio lengths leading with
  credentials; newsletter cadence + optional dated proof; testimonial-then-CTA.
- custom.css: sticky mobile booking CTA; desaturated logo-bar treatment.
- BUILD_CHECKLIST: sticky CTA, episode captions, internal linking, archive
  search/filter, web EPK, desaturated logos, AA body-contrast test.

Source basis: where a site is named on "best speaker website" merit it rests on
recurring roundup citation rather than measured traffic; conversion claims (form
fields, dropdowns, CTA count, fee practice) are from marketing/conversion sources
(SpeakrBrand, The Speaker Lab, Omnisend, IMARC, Maria Franzoni, OptinMonster) and
cross-checked across multiple articles.
