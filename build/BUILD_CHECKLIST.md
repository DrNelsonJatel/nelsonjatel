# nelsonjatel.com  ·  Squarespace build checklist (v1)

Platform: Squarespace 7.1, Business plan or higher (needed for Custom CSS, Code
Injection, and Code Blocks). On Personal, see the fallback notes marked PERSONAL.

Work top to bottom. Nothing ships with a visible placeholder; hide unfinished
sections until their content exists.

---

## 0. Before you build

- [ ] Confirm the Squarespace plan is Business or higher.
- [ ] Set up the mailbox `hello@nelsonjatel.com` (Google Workspace via Squarespace,
      or your own). Test it receives mail.
- [ ] Decide the newsletter ESP (the brief asks to tie into the existing Freshwater
      Focus audience). Squarespace Email Campaigns, or Mailchimp/Kit if that is
      where Freshwater Focus already lives. This determines the footer signup block.
- [ ] Action the COI check (outside-activity / use-of-position) before going
      commercial. Keep OBWB/UBCO titles off the public pages until cleared.

## 1. Template & global styles

- [ ] Start from a minimal, type-led 7.1 template (e.g. one of the portfolio or
      personal templates with a strong editorial layout). Avoid anything with heavy
      built-in decoration.
- [ ] Settings > Advanced > Code Injection > HEADER: paste `header-code-injection.html`
      (loads the three fonts + Open Graph defaults).
- [ ] Design > Custom CSS: paste `custom.css` in full.
- [ ] Design > Fonts: set the Assigned font families so the editor previews match,
      Headings = Instrument Serif, Paragraphs = Instrument Sans. (The CSS enforces
      this regardless, but matching the editor avoids surprises.)
- [ ] Design > Colours: create a dark theme using the palette. Section background
      `#0E2A38` (ground), text `#EAF2F4` (ink), buttons `#F3B24E` (signal) with
      `#08202B` text. Apply this theme to all sections by default.

## 2. Navigation

Primary nav (in this order): Home · Speaking · Signals in the Stream · Books · About · Contact
- [ ] Build the five/six primary pages.
- [ ] Put Bio, Credentials, and CV under About as in-page sections, not nav items.
- [ ] If Books is not ready, remove it from the nav entirely (do not grey it out).

## 3. Home

- [ ] Hero section: paste hero H1, subhead, and brand line from WebPackage section 2.
- [ ] Add the signal motif: Code Block with `hero-signal.html`.
      PERSONAL fallback: set a cropped `JATEL_EndCard_v1_20260619.png` as the hero
      background image instead, no animation.
- [ ] Primary button: "Invite Nelson to speak" -> links to Speaking (or its form).
- [ ] Secondary text link: "Watch Signals in the Stream" -> the series page.
- [ ] Proof bar: "Where I've spoken" with verified names only (CWRA Winnipeg 2026,
      UBC Okanagan, plus any you confirm). Names as text; add logos only with
      permission.
- [ ] Three pillars (Speak / Signals in the Stream / Books) as cards, copy from
      WebPackage section 2. Drop the Books card if Books is hidden.
- [ ] Latest short: embed the newest YouTube short (Squarespace updates this
      manually; revisit when you post).
- [ ] Testimonial block: include only if you have a real quote. Otherwise hide.
- [ ] Closing CTA band: "Invite Nelson to speak".
- [ ] Between major sections, add a Line block with class `nj-trace` for the amber
      hairline echo (add the class via the block's design options or a Code Block).

## 4. Speaking

- [ ] Paste all Speaking copy from `copy/COPY_DECK.md`.
- [ ] Build the booking form (native Form block) with the listed fields. Route
      submissions to `hello@nelsonjatel.com` and/or a Google Sheet.
- [ ] Set the form confirmation message from the deck.
- [ ] Add the speaker-kit download once the PDF exists; hide the link until then.

## 5. Signals in the Stream (the SEO engine)

- [ ] Create a Blog collection named "Signals in the Stream".
- [ ] Set the URL slug to /signals (or similar) and add it to the nav.
- [ ] Build one post per episode using the template in the deck: embedded short,
      80 to 150 word write-up, full transcript, closer line, inline newsletter.
- [ ] Seed with the two existing explainer videos, each with a real transcript.
- [ ] Add categories: Governance, Water, Methods.
- [ ] Per post: set SEO title, meta description, and the OG image (reuse the
      end-card art or a 9:16 variant when built).
- [ ] Transcripts are non-negotiable. No episode ships without one.

## 6. About

- [ ] Paste the About story, then the 50/150 bios from WebPackage section 2.
- [ ] Credentials block in mono treatment (class `nj-credential`).
- [ ] Full disclaimer text on this page.
- [ ] Professional stage photo when available (apply teal duotone for unity);
      hide the photo slot until you have one.
- [ ] CV download link once the PDF exists.

## 7. Contact

- [ ] Paste Contact copy. Native Form block (Name, Email, Organisation, Message).
- [ ] Show `hello@nelsonjatel.com` and the two-business-day response line.
- [ ] No fundraiser / nonprofit language anywhere (template residue).

## 8. Footer (site-wide)

- [ ] Newsletter signup block wired to the chosen ESP.
- [ ] Social links (YouTube @Dr.NelsonJatel, LinkedIn).
- [ ] Generic disclaimer in mono fine print (class `nj-disclaimer`):
      "Personal views only. Not representative of any affiliated organisation."
- [ ] Copyright: © 2026 Dr. Nelson Jatel. (Never "Water Doc" anywhere.)

## 9. Domain

- [ ] Settings > Domains > Connect a domain: connect `nelsonjatel.com`. This
      replaces the current forward to waters.ca.
- [ ] Set `www` and root both resolving; pick the canonical (recommend root
      `nelsonjatel.com`, with www redirecting, or vice versa, just be consistent).
- [ ] Confirm SSL is active (Squarespace auto-provisions; verify the padlock).

## 10. Pre-launch QA (the quality floor)

- [ ] Proofread every page to zero typos. This site sells a communicator.
- [ ] Scan all copy for em dashes, double hyphens, US spelling, and "Water Doc".
- [ ] Check every text/background pair against WCAG AA (see contrast note in
      `custom.css`).
- [ ] Test keyboard navigation: visible focus ring on every link, button, field.
- [ ] Test `prefers-reduced-motion`: hero resolves with no animation, nothing
      else animates. (macOS: System Settings > Accessibility > Display > Reduce
      motion, then reload.)
- [ ] Test on a real phone (the shorts audience is mobile-first).
- [ ] Run Lighthouse (Chrome DevTools) on Home and one episode page; aim for green
      on Performance and Accessibility.
- [ ] Verify every CTA reaches "Invite Nelson to speak" within one click.
- [ ] Confirm no BarrierFlow content anywhere.
- [ ] Submit a test booking and a test contact message; confirm they arrive.

## 11. Post-launch

- [ ] Submit sitemap to Google Search Console; claim the personal-name searches.
- [ ] Add each new short as its own post with a transcript, the long-tail engine.
- [ ] Build the outstanding assets: 9:16 end-card, speaker one-sheet PDF, CV PDF,
      stage photography, testimonials, finalised keynote titles and book list.
