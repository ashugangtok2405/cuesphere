alter table public.matches add column if not exists current_break_balls jsonb not null default '[]'::jsonb;
alter table public.matches add column if not exists reds_remaining integer not null default 15;
