alter table public.tournaments add column if not exists image_url text not null default '';

insert into storage.buckets (id, name, public)
values ('tournament-thumbnails', 'tournament-thumbnails', true)
on conflict (id) do nothing;
