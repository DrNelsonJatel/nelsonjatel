-- Keepalive heartbeat for the free-plan Supabase project (ref dlgkcmmbkmcjptopqyda).
-- A daily read alone was judged "insufficient activity" (pause warning 2026-11-13),
-- so the keepalive now performs a real write. Single fixed row: the table never grows,
-- so exposing the ping to the publishable key cannot be used to bloat storage.
-- Applied once in the dashboard SQL editor. Idempotent.

create table if not exists public.keepalive (
  id        smallint primary key check (id = 1),
  pinged_at timestamptz not null default now(),
  pings     bigint      not null default 0
);
insert into public.keepalive (id) values (1) on conflict (id) do nothing;

-- No direct table access for API roles; RLS on with no policies as a second lock.
alter table public.keepalive enable row level security;
revoke all on public.keepalive from anon, authenticated;

-- The only way in: bump the single row and return the new timestamp.
create or replace function public.keepalive_ping()
returns timestamptz
language sql
security definer
set search_path = ''
as $$
  update public.keepalive
     set pinged_at = now(), pings = pings + 1
   where id = 1
  returning pinged_at;
$$;
revoke all on function public.keepalive_ping() from public, authenticated;
grant execute on function public.keepalive_ping() to anon;

-- QAQC: one row, ping works, direct table read is refused to anon.
do $$
declare n int; t timestamptz;
begin
  select count(*) into n from public.keepalive;
  if n <> 1 then raise exception 'FLAG keepalive row count = % (expected 1)', n; end if;
  t := public.keepalive_ping();
  if t is null or t < now() - interval '1 minute' then raise exception 'FLAG ping returned %', t; end if;
  if has_table_privilege('anon', 'public.keepalive', 'select') then raise exception 'FLAG anon can read table'; end if;
  if not has_function_privilege('anon', 'public.keepalive_ping()', 'execute') then raise exception 'FLAG anon cannot execute ping'; end if;
  raise notice 'PASS keepalive: 1 row, ping ok, anon table access revoked, anon rpc granted';
end $$;
