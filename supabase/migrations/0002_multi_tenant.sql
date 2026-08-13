-- CueSphere — multi-tenant foundation
-- Introduces clubs, club_memberships (role-per-club) and platform_admins,
-- adds club_id to every tenant-scoped table, and rewrites RLS to be
-- club-aware. Tournaments themselves remain static mock data for now (per
-- product decision) — they carry a clubId in application code, not a table.

-- ---------------------------------------------------------------------------
-- clubs
-- ---------------------------------------------------------------------------
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  logo_url text not null default '',
  primary_color text not null default '#D4AF37',
  secondary_color text not null default '#0B0E12',
  hero_banner_url text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  google_maps_url text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  status text not null default 'approved' check (status in ('pending', 'approved', 'suspended')),
  created_at timestamptz not null default now()
);

alter table public.clubs enable row level security;

create policy "clubs_select_public" on public.clubs
  for select using (true);

-- ---------------------------------------------------------------------------
-- club_memberships  (one user, many clubs, one role per club)
-- ---------------------------------------------------------------------------
create table if not exists public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  member_id text not null default '',
  role text not null check (
    role in ('club_admin', 'club_staff_receptionist', 'club_staff_referee', 'club_staff_scorekeeper', 'player')
  ),
  created_at timestamptz not null default now(),
  unique (club_id, user_id)
);

alter table public.club_memberships enable row level security;

create policy "memberships_select_own" on public.club_memberships
  for select using (auth.uid() = user_id);
create policy "memberships_insert_own" on public.club_memberships
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- platform_admins  (rare, manually seeded — not self-serve)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;

create policy "platform_admins_select_own" on public.platform_admins
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- helper functions (security definer so they can read club_memberships
-- regardless of the calling policy's own RLS context)
-- ---------------------------------------------------------------------------
create or replace function public.is_club_member(target_club_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.club_memberships
    where club_id = target_club_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_club_staff(target_club_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.club_memberships
    where club_id = target_club_id
      and user_id = auth.uid()
      and role in ('club_admin', 'club_staff_receptionist', 'club_staff_referee', 'club_staff_scorekeeper')
  );
$$;

-- ---------------------------------------------------------------------------
-- add club_id to existing tenant-scoped tables
-- ---------------------------------------------------------------------------
alter table public.tournament_registrations add column if not exists club_id uuid references public.clubs (id);
alter table public.payments add column if not exists club_id uuid references public.clubs (id);
alter table public.notifications add column if not exists club_id uuid references public.clubs (id);
alter table public.matches add column if not exists club_id uuid references public.clubs (id);
alter table public.player_statistics add column if not exists club_id uuid references public.clubs (id);
alter table public.achievements add column if not exists club_id uuid references public.clubs (id);
alter table public.tournament_results add column if not exists club_id uuid references public.clubs (id);

-- ---------------------------------------------------------------------------
-- backfill: create Club #1 and attach all existing data to it
-- ---------------------------------------------------------------------------
insert into public.clubs (slug, name, tagline, status)
values ('xyz-snooker-club', 'XYZ Snooker Club', 'Where Passion Meets Precision', 'approved')
on conflict (slug) do nothing;

update public.tournament_registrations set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;
update public.payments p set club_id = r.club_id from public.tournament_registrations r where p.registration_id = r.id and p.club_id is null;
update public.notifications set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;
update public.matches set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;
update public.player_statistics set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;
update public.achievements set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;
update public.tournament_results set club_id = (select id from public.clubs where slug = 'xyz-snooker-club') where club_id is null;

-- every existing player profile becomes a 'player' member of Club #1,
-- carrying their old member_id forward as their club-specific member_id
insert into public.club_memberships (club_id, user_id, member_id, role)
select (select id from public.clubs where slug = 'xyz-snooker-club'), user_id, member_id, 'player'
from public.player_profiles
on conflict (club_id, user_id) do nothing;

-- player_statistics was previously keyed 1 row per player globally; it's now
-- 1 row per player *per club*, so the primary key must include club_id.
-- (done after backfill so the new PK column is never null)
alter table public.player_statistics drop constraint if exists player_statistics_pkey;
alter table public.player_statistics add primary key (player_id, club_id);

-- now that club_id is backfilled, enforce it going forward
alter table public.tournament_registrations alter column club_id set not null;
alter table public.payments alter column club_id set not null;
alter table public.notifications alter column club_id set not null;
alter table public.matches alter column club_id set not null;
alter table public.player_statistics alter column club_id set not null;
alter table public.achievements alter column club_id set not null;
alter table public.tournament_results alter column club_id set not null;

-- ---------------------------------------------------------------------------
-- rewrite RLS: drop old single-tenant policies, add club-aware ones
-- ---------------------------------------------------------------------------
drop policy if exists "registrations_select_own" on public.tournament_registrations;
drop policy if exists "registrations_insert_own" on public.tournament_registrations;
create policy "registrations_select_own_or_staff" on public.tournament_registrations
  for select using (
    player_id in (select id from public.player_profiles where user_id = auth.uid())
    or public.is_club_staff(club_id)
  );
create policy "registrations_insert_own" on public.tournament_registrations
  for insert with check (
    player_id in (select id from public.player_profiles where user_id = auth.uid())
  );
create policy "registrations_update_staff" on public.tournament_registrations
  for update using (public.is_club_staff(club_id));

drop policy if exists "payments_select_own" on public.payments;
drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_select_own_or_staff" on public.payments
  for select using (
    registration_id in (
      select r.id from public.tournament_registrations r
      join public.player_profiles p on p.id = r.player_id
      where p.user_id = auth.uid()
    )
    or public.is_club_staff(club_id)
  );
create policy "payments_insert_own" on public.payments
  for insert with check (
    registration_id in (
      select r.id from public.tournament_registrations r
      join public.player_profiles p on p.id = r.player_id
      where p.user_id = auth.uid()
    )
  );
create policy "payments_update_staff" on public.payments
  for update using (public.is_club_staff(club_id));

drop policy if exists "matches_select_authenticated" on public.matches;
create policy "matches_select_club_members" on public.matches
  for select using (public.is_club_member(club_id));

drop policy if exists "player_statistics_select_authenticated" on public.player_statistics;
create policy "player_statistics_select_club_members" on public.player_statistics
  for select using (public.is_club_member(club_id));

drop policy if exists "achievements_select_authenticated" on public.achievements;
create policy "achievements_select_club_members" on public.achievements
  for select using (public.is_club_member(club_id));

drop policy if exists "tournament_results_select_authenticated" on public.tournament_results;
create policy "tournament_results_select_club_members" on public.tournament_results
  for select using (public.is_club_member(club_id));
