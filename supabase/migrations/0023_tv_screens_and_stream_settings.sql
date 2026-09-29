-- Table TVs pair with a table by showing a short code that club staff enter
-- in the admin panel. The TV keeps a random device token to identify itself.
create table if not exists public.tv_screens (
  id uuid primary key default gen_random_uuid(),
  device_token text not null unique,
  pair_code text unique,
  code_expires_at timestamptz,
  club_id uuid references public.clubs (id) on delete cascade,
  table_number integer check (table_number between 1 and 99),
  paired_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists tv_screens_club_idx on public.tv_screens (club_id);

-- Only the server (service role) reads or writes TV screens.
alter table public.tv_screens enable row level security;

-- Per-club live-stream overlay settings: YouTube link per table, sponsor
-- logos, accent colour and which overlay elements are shown.
create table if not exists public.club_stream_settings (
  club_id uuid primary key references public.clubs (id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.club_stream_settings enable row level security;
