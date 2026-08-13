-- CueSphere — real, club-owned tournaments.
-- XYZ Snooker Club's existing tournament content stays on the static mock
-- data it already has (untouched) — this table is for tournaments created
-- by club admins through the Club Admin panel, starting with new clubs.

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  start_date date,
  end_date date,
  location text not null default '',
  prize_pool text not null default '',
  entry_fee text not null default '',
  format text not null default 'Knockout',
  max_players integer not null default 32,
  registration_open boolean not null default true,
  created_at timestamptz not null default now(),
  unique (club_id, slug)
);

alter table public.tournaments enable row level security;

create policy "tournaments_select_public" on public.tournaments
  for select using (true);

create policy "tournaments_insert_staff" on public.tournaments
  for insert with check (public.is_club_staff(club_id));

create policy "tournaments_update_staff" on public.tournaments
  for update using (public.is_club_staff(club_id));

create policy "tournaments_delete_staff" on public.tournaments
  for delete using (public.is_club_staff(club_id));
