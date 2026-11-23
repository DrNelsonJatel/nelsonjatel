// GET /api/keepalive: daily Vercel cron (vercel.json "crons") that makes one
// tiny write in Postgres so the free-plan Supabase project is never idle
// for 7 days and paused. Found paused on 2026-10-30, which had silently
// broken the live newsletter and enquiry forms.
//
// A Vercel Function, not an Astro page: the site is static output with no
// adapter. Uses the same publishable key the browser already has. RLS returns
// nothing direct to it; the keepalive_ping() RPC (security definer) is its only
// way to touch the heartbeat row. Also pinged every 6 h by
// .github/workflows/keepalive.yml, so one missed run is not a gap.
//
// If CRON_SECRET is set in the Vercel project, Vercel sends it as a bearer
// token and anything else is refused.

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return json(401, { ok: false });
  }

  const url = process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.PUBLIC_SUPABASE_KEY;
  if (!url || !key) {
    console.error('keepalive: PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_KEY not set');
    return json(503, { ok: false, error: 'not configured' });
  }

  try {
    // A real write (scripts/keepalive.sql): one fixed row bumped by an RPC.
    // A read-only ping was judged "insufficient activity" on 2026-11-13.
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    let res = await fetch(`${url}/rest/v1/rpc/keepalive_ping`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{}',
    });
    // RPC not created yet (SQL not applied): fall back to the old read so the
    // ping never lapses, but log it loudly.
    if (res.status === 404) {
      console.error('keepalive: keepalive_ping() missing, apply scripts/keepalive.sql; falling back to read');
      res = await fetch(`${url}/rest/v1/subscribers?select=id&limit=1`, { headers });
    }
    // Non-2xx surfaces as a failed cron invocation in the Vercel logs.
    if (!res.ok) console.error(`keepalive: Supabase returned ${res.status}`);
    return json(res.ok ? 200 : 502, { ok: res.ok, status: res.status });
  } catch (e) {
    console.error('keepalive: Supabase unreachable', e);
    return json(502, { ok: false, error: 'unreachable' });
  }
}
