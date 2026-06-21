# The Signal · Weak Ties: Brand Changeset v2 for Claude Code (cc)

**For:** cc
**Date:** 21 June 2026
**Supersedes:** `JATEL_BrandChangeset_v1`.
**Companion to:** `CONTENT_BRIEF.md`, `JATEL_DevBrief_v1`, `JATEL_FilingMemo_v1`.

## What changed from v1 (read this)

v1 retired "The Signal" and renamed everything to Weak Ties. That was wrong. The corrected structure:
- The **channel stays Dr. Nelson Jatel** (the site and YouTube channel are the person).
- **"The Signal" is kept** as the publication name for both the newsletter and the vlog.
- **"Weak Ties" is the series and the tagline**, shown with the masthead as **The Signal · Weak Ties**.
- Only **"Signals in the Stream" retires**.
- Positioning base shifts to **social networks, change theory, and decision theory**, with **governance minimised** to one example domain and water as a recurring example.

Nothing in the publishing pipeline changes (collections, thread-slug linking, guardrails, Supabase to Kit, sitemap, RSS). Brand layer only.

---

## Part A: The changeset

### 1. Brand hierarchy (the model to hold)
- **Channel / person / site:** Dr. Nelson Jatel · Social Networks, Change & Decisions. (`nelsonjatel.com`; YouTube channel "Nelson Jatel".)
- **Publication:** The Signal.
- **Series and tagline:** Weak Ties.
- **Lockup:** **The Signal · Weak Ties**, used on both the newsletter and the vlog; the weekly shorts sit under it too.
- One sentence: Nelson Jatel is the channel; The Signal · Weak Ties is his publication; the subject is how decisions get made and how change happens, traced through social networks.

### 2. Names
- Retire "Signals in the Stream" everywhere (old vlog series name).
- Keep "The Signal" as the publication name for both newsletter and vlog.
- Add "Weak Ties" as the series and tagline; display as "The Signal · Weak Ties."
- Replace the old newsletter tagline "a monthly long read" with "Weak Ties."
- Do not add "signal" to the content lint. The closer line uses the word, and "The Signal" is a kept product name.

### 3. Positioning (minimise governance)
- Base: social network analysis applied to **decision theory and change theory**, how decisions actually get made, and how change actually happens.
- Governance is demoted to one example domain, not the headline. Water is a recurring example, not the frame.
- Retire "where water, governance, and networks meet."

### 4. Wordmark and descriptor (channel level)
- **"Dr. Nelson Jatel · Social Networks, Change & Decisions."**
- Store the descriptor as a single brand constant so it can be swapped in one place. Acceptable alternative: "· Networks, Change & Decision."

### 5. Home hero
- The home page leads with the channel (the person), not the publication.
- H1: Dr. Nelson Jatel.
- Subhead: **"How decisions get made, and how change actually happens, traced through the hidden networks behind them."**
- Feature The Signal · Weak Ties on the page as his series, with the subscribe path.

### 6. Verbal bookends (video and voice)
- Opener (fixed): **"I'm Nelson Jatel, and this is The Signal, where we trace the weak ties behind how decisions get made and how change really happens."**
- Closer (unchanged): **"It all feels like noise, until you trace the signal."** Keeping "The Signal" means the closer now echoes the publication name, which is a bonus, not an accident.

### 7. Newsletter and vlog masthead
- Masthead: **The Signal · Weak Ties.**
- Newsletter subhead (replacing the old water line): **"One idea a month on the hidden networks behind how we decide and how we change. Traced in full, no noise."**
- The vlog uses the same masthead.

### 8. Visual identity
- Rename the identity system from "Hydrographic Signal" to **"Node and Trace."**
- Remove water, stream, and hydro imagery and metaphors.
- Keep unchanged: the palette, the typography (Instrument Serif, Instrument Sans, IBM Plex Mono), and the amber-line-out-of-nodes motif (a network graph).

### 9. Where this lands in the repo
- Global site config: title, meta description, the wordmark and descriptor constant.
- Header and footer wordmark; retire any nav label that named "Signals in the Stream."
- Home hero, meta, OG text.
- About page: use the explainer in Part B.
- Newsletter masthead and subhead; the email masthead in the send-edition template.
- **Kit tag: stays "The Signal." No rename needed** (this reverses v1's rename instruction).
- RSS feed title and description: "The Signal · Weak Ties."
- End-card and OG card wordmark text (the closer line stays).
- Routes and slugs are unaffected; keep `/signals` and `/newsletter`.

### 10. Do not touch, and acceptance
- Untouched: content schemas, the `thread` key, guardrails, Supabase to Kit, draft filtering, sitemap, RSS plumbing.
- Acceptance: no "Signals in the Stream" anywhere user-facing; "The Signal · Weak Ties" on the newsletter and vlog; the channel reads "Dr. Nelson Jatel · Social Networks, Change & Decisions"; governance is no longer in the headline; closer line and node motif intact; build green and lint passing.

---

## Part B: The explainer (where "Weak Ties" comes from, and why it matters)

Paste-ready for the About page, and the reason for the series name.

### Why this name
The name encodes the thesis in two words. The relationships an organisation treats as minor, the casual, bridging ones, are often what actually move a decision or carry a change. "Weak ties" is the technical name for exactly that, so the series name and the message are the same thing.

### Short version (bio, meta, social)
> Weak ties are the casual, bridging relationships that connect otherwise separate groups. The sociologist Mark Granovetter showed they carry more new information and opportunity than our closest connections do. The Signal · Weak Ties uses that lens, social network analysis in plain language, to trace how decisions get made and how change really happens.

### Long version (About page, first person)
> The name comes from a 1973 paper by the sociologist Mark Granovetter, "The Strength of Weak Ties," one of the most cited ideas in social science. The argument is counterintuitive. Your strong ties, close friends, family, the people you see every day, tend to know what you already know, because you all move in the same circle. Your weak ties, the acquaintances and casual contacts, reach into circles you do not, so they are the ones who carry new information across the gaps. Granovetter found that people more often landed jobs through these weaker connections than through their closest ones.
>
> That gap-crossing is the point. Weak ties are the bridges in a network, and information, influence, and change travel across bridges. The quiet person who connects two groups that would otherwise never talk often shapes a decision more than whoever sits at the top of the chart. You cannot see this on an org chart. You can only see it by mapping the relationships themselves, which is what social network analysis does.
>
> That is what this work is about: how decisions actually get made, and how change actually spreads. Not the formal version on paper, but the real version that runs through people and the ties between them. I have spent twenty years tracing these networks. The examples come from water and many other settings, but the lesson is general: if you want to understand a decision or a change, follow the ties, especially the weak ones.
>
> It all feels like noise, until you trace the signal.

---

## References
- Granovetter, M. S. (1973). The strength of weak ties. *American Journal of Sociology, 78*(6), 1360 to 1380. Foundational source; cited from canonical training knowledge, not a retrieved page. Verify the page range before print if exactness matters.
- Granovetter, M. S. (1974). *Getting a job: A study of contacts and careers.* Harvard University Press.

---

*Do-now versus blocked:* cc can apply the whole changeset now. The only adjustable knob is the channel descriptor string (section 4), isolated to one constant.
