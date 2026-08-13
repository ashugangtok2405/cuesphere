alter table public.matches add column if not exists current_frame_score_player1 integer not null default 0;
alter table public.matches add column if not exists current_frame_score_player2 integer not null default 0;
alter table public.matches add column if not exists current_break integer not null default 0;
