alter table public.matches add column if not exists frame_scores jsonb not null default '[]'::jsonb;
