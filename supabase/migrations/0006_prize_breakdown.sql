alter table public.tournaments add column if not exists prize_breakdown jsonb not null default '[]'::jsonb;
