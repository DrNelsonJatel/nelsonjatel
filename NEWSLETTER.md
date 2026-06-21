# The Signal — newsletter operations

Monthly long-read newsletter, native on Supabase + Resend. Companion to the
weekly *Signals in the Stream* video shorts.

## Architecture

- **Subscribers**: `public.subscribers` in Supabase (project `nelsonjatel`,
  ca-central-1). Columns: `email` (unique, case-insensitive), `status`
  (`pending` → `confirmed` → `unsubscribed`), random `confirm_token` /
  `unsubscribe_token`, `source`, timestamps.
- **Signup** (`src/components/NewsletterForm.astro` + `src/scripts/newsletter.ts`):
  the publishable key can only INSERT a `pending` row (RLS). No read/update/delete
  from the web; tokens never reach the browser.
- **Double opt-in**: an INSERT trigger emails a confirmation link
  (`/confirm?token=`); confirming flips status and fires a welcome email.
  Unsubscribe link (`/unsubscribe?token=`) flips to `unsubscribed`. Confirm and
  unsubscribe run via token-gated `SECURITY DEFINER` RPCs.
- **Email**: Resend, from `signal@send.nelsonjatel.com` (verified domain). The
  API key lives in Supabase Vault, never in the repo. Enquiry notifications use
  `enquiries@send.nelsonjatel.com`.
- **Archive**: editions are markdown in `src/content/newsletter/`, rendered at
  `/newsletter` and `/newsletter/<slug>`.

The DB objects (table, RLS, triggers, RPCs, `send_edition`) are managed as
Supabase migrations; this file is the operator's guide.

## Sending an edition

The engine is the `send_edition(subject, html, text, test_email)` Postgres
function: it batches confirmed subscribers (≤100 per Resend call), adds a
per-recipient unsubscribe footer + `List-Unsubscribe` header, and uses the Vault
key. It is **service-role only** and cannot be triggered from the website.

Drive it with the renderer script:

```sh
# 1. one-time: add the service-role key to .env.local (gitignored)
#    SUPABASE_SERVICE_ROLE_KEY=...   (Supabase dashboard > Settings > API)

node scripts/send-edition.mjs 01-signal-and-noise                 # dry run: shows count + preview
node scripts/send-edition.mjs 01-signal-and-noise --test you@x.io # send yourself a copy first
node scripts/send-edition.mjs 01-signal-and-noise --send          # broadcast to all confirmed
```

Always `--test` to yourself before `--send`.

## Managing subscribers

Read/export the list only from the Supabase dashboard (service-role). To add
someone manually as confirmed, insert with `status='confirmed'`. Deletion on
request is handled per the `/privacy` page.
