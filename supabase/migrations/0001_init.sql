-- XYZ Snooker Club — initial schema
-- Tournaments themselves stay as static mock data in the app code (no table).
-- This schema covers user-generated data: profiles, registrations, payments,
-- notifications, matches, statistics, achievements and results.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- player_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  member_id text not null,
  full_name text not null default '',
  email text not null default '',
  mobile text not null default '',
  dob date,
  city text not null default '',
  emergency_contact text not null default '',
  profile_photo_url text not null default '',
  preferred_cue text not null default '',
  created_at timestamptz not null default now()
);

alter table public.player_profiles enable row level security;

create policy "player_profiles_select_own" on public.player_profiles
  for select using (auth.uid() = user_id);
create policy "player_profiles_insert_own" on public.player_profiles
  for insert with check (auth.uid() = user_id);
create policy "player_profiles_update_own" on public.player_profiles
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- tournament_registrations  (tournament_id refers to the static mock catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null,
  tournament_id text not null,
  player_id uuid not null references public.player_profiles (id) on delete cascade,
  status text not null check (status in ('pending_approval', 'confirmed', 'cancelled')),
  emergency_contact text not null default '',
  preferred_cue text not null default '',
  notes text not null default '',
  agreed_to_rules boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tournament_registrations enable row level security;

create policy "registrations_select_own" on public.tournament_registrations
  for select using (
    player_id in (select id from public.player_profiles where user_id = auth.uid())
  );
create policy "registrations_insert_own" on public.tournament_registrations
  for insert with check (
    player_id in (select id from public.player_profiles where user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.tournament_registrations (id) on delete cascade,
  method text not null check (method in ('online', 'offline')),
  status text not null check (status in ('pending', 'paid', 'failed')),
  amount numeric not null default 0,
  payment_id text,
  transaction_id text,
  payment_date timestamptz
);

alter table public.payments enable row level security;

create policy "payments_select_own" on public.payments
  for select using (
    registration_id in (
      select r.id from public.tournament_registrations r
      join public.player_profiles p on p.id = r.player_id
      where p.user_id = auth.uid()
    )
  );
create policy "payments_insert_own" on public.payments
  for insert with check (
    registration_id in (
      select r.id from public.tournament_registrations r
      join public.player_profiles p on p.id = r.player_id
      where p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- notifications  (system-generated; inserted via service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  channel text not null check (channel in ('website', 'email')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- matches  (draw / fixtures; written via service role only — stands in for
-- a future admin panel)
-- ---------------------------------------------------------------------------
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id text not null,
  round text not null,
  table_number integer not null,
  player1_id uuid not null references public.player_profiles (id) on delete cascade,
  player1_name text not null,
  player2_id text not null,
  player2_name text not null,
  reporting_time text not null,
  match_start_time text not null,
  status text not null check (status in ('awaiting_draw', 'scheduled', 'live', 'completed')),
  winner_id text,
  score text,
  frames_won_player1 integer not null default 0,
  frames_won_player2 integer not null default 0,
  highest_break integer not null default 0,
  highest_break_player_id text,
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "matches_select_authenticated" on public.matches
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- player_statistics  (written via service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.player_statistics (
  player_id uuid primary key references public.player_profiles (id) on delete cascade,
  tournaments_played integer not null default 0,
  matches_played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  frames_won integer not null default 0,
  frames_lost integer not null default 0,
  highest_break integer not null default 0,
  ranking_points integer not null default 0,
  prize_money numeric not null default 0,
  recent_form text[] not null default '{}'
);

alter table public.player_statistics enable row level security;

create policy "player_statistics_select_authenticated" on public.player_statistics
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- achievements  (written via service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.player_profiles (id) on delete cascade,
  title text not null,
  description text not null,
  date_awarded timestamptz not null default now(),
  icon text not null check (icon in ('trophy', 'medal', 'flame', 'star'))
);

alter table public.achievements enable row level security;

create policy "achievements_select_authenticated" on public.achievements
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- tournament_results  (written via service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.tournament_results (
  id uuid primary key default gen_random_uuid(),
  tournament_id text not null,
  player_id uuid not null references public.player_profiles (id) on delete cascade,
  position integer not null,
  prize_money numeric not null default 0
);

alter table public.tournament_results enable row level security;

create policy "tournament_results_select_authenticated" on public.tournament_results
  for select using (auth.role() = 'authenticated');
