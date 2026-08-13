-- Per-tournament, self-expiring scorekeeper access — replaces granting a
-- club-wide staff role just to score one tournament's matches. Access is
-- gated at query time on the tournament not being completed, so there is
-- nothing to revoke when the admin ends the tournament.
create table if not exists public.tournament_scorekeepers (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

alter table public.tournament_scorekeepers enable row level security;

create policy "tournament_scorekeepers_select_own" on public.tournament_scorekeepers
  for select using (auth.uid() = user_id or public.is_club_staff(club_id));

create policy "tournament_scorekeepers_insert_staff" on public.tournament_scorekeepers
  for insert with check (public.is_club_staff(club_id));

create policy "tournament_scorekeepers_delete_staff" on public.tournament_scorekeepers
  for delete using (public.is_club_staff(club_id));
