// Broadcast a Signal edition to confirmed subscribers.
//
// Renders an edition's markdown to {subject, html, text} and calls the
// `send_edition` Postgres function (the engine), which does the batched Resend
// send using the Vault key and the subscribers table. Secrets stay in the DB;
// this script only needs the Supabase service-role key to invoke the engine.
//
// Setup: add to .env.local (gitignored)
//   PUBLIC_SUPABASE_URL=...            (already present)
//   SUPABASE_SERVICE_ROLE_KEY=...      (Supabase dashboard > Project settings > API)
//
// Usage:
//   node scripts/send-edition.mjs <slug>                 # dry run (no send)
//   node scripts/send-edition.mjs <slug> --test you@x.io # one test email
//   node scripts/send-edition.mjs <slug> --send          # send to all confirmed
//
//   <slug> is the edition filename without .md, e.g. 01-signal-and-noise

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { marked } from 'marked';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env / .env.local loader (no dependency).
function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    try {
      for (const line of readFileSync(join(root, f), 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    } catch {}
  }
}
loadEnv();

const URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const [slug, ...rest] = process.argv.slice(2);
const testIdx = rest.indexOf('--test');
const testEmail = testIdx >= 0 ? rest[testIdx + 1] : null;
const doSend = rest.includes('--send');

if (!slug) {
  console.error('Usage: node scripts/send-edition.mjs <slug> [--test <email>] [--send]');
  process.exit(1);
}

// Parse the edition: frontmatter (title, dek, issue, draft) + markdown body.
const raw = readFileSync(join(root, 'src/content/newsletter', `${slug}.md`), 'utf8');
const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!fm) { console.error('Could not parse front matter.'); process.exit(1); }
const meta = Object.fromEntries(
  fm[1].split('\n').map((l) => {
    const i = l.indexOf(':');
    return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
  }).filter(Boolean)
);
const body = fm[2].trim();
const editionUrl = `https://nelsonjatel.com/newsletter/${slug}`;
const subject = `The Signal: ${meta.title}`;

const html = `<div style="max-width:600px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;color:#15242b;line-height:1.6;font-size:17px">
  <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:0.06em;color:#7a8a91;text-transform:uppercase">The Signal &middot; Issue ${meta.issue}</p>
  <h1 style="font-size:26px;line-height:1.2;margin:0.2em 0">${meta.title}</h1>
  <p style="color:#52636b;font-style:italic;font-size:18px">${meta.dek}</p>
  ${marked.parse(body)}
  <p style="margin-top:1.5em"><a href="${editionUrl}" style="color:#c7811f">Read this edition online &rarr;</a></p>
</div>`;

// Plain-text version: strip the lightest markdown so it reads cleanly.
const text =
  `THE SIGNAL · Issue ${meta.issue}\n${meta.title}\n${meta.dek}\n\n` +
  body.replace(/^#+\s*/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1') +
  `\n\nRead online: ${editionUrl}`;

async function callEngine(extra) {
  const res = await fetch(`${URL}/rest/v1/rpc/send_edition`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_subject: subject, p_html: html, p_text: text, ...extra }),
  });
  if (!res.ok) throw new Error(`Engine HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function confirmedCount() {
  const res = await fetch(`${URL}/rest/v1/subscribers?status=eq.confirmed&select=email`, {
    method: 'HEAD',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'count=exact' },
  });
  return Number((res.headers.get('content-range') || '*/0').split('/')[1]) || 0;
}

if (!URL || !SERVICE_KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (add the service-role key to .env.local).');
  process.exit(1);
}

console.log(`\nEdition: ${slug}`);
console.log(`Subject: ${subject}`);
if (meta.draft === 'true') console.log('NOTE: this edition is still draft:true on the site.');

if (testEmail) {
  const r = await callEngine({ p_test_email: testEmail });
  console.log(`\nTest send →`, r);
} else if (doSend) {
  const n = await confirmedCount();
  const r = await callEngine({});
  console.log(`\nLive send → ${JSON.stringify(r)} (confirmed at start: ${n})`);
} else {
  const n = await confirmedCount();
  console.log(`\nDRY RUN. Confirmed subscribers: ${n}`);
  console.log('Add --test <email> to send yourself a copy, or --send to broadcast.');
  console.log(`\n--- text preview ---\n${text.slice(0, 600)}${text.length > 600 ? '…' : ''}`);
}
