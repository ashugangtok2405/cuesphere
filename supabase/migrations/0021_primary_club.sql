-- Lets a player mark which club they primarily represent, shown next to
-- their name across the player directory and friends list so others can see
-- who plays for whom at a glance.
alter table public.player_profiles
  add column if not exists primary_club_id uuid references public.clubs (id) on delete set null;
