alter table public.tournaments add column if not exists champion_id uuid references public.player_profiles (id) on delete set null;
alter table public.tournaments add column if not exists runner_up_id uuid references public.player_profiles (id) on delete set null;
