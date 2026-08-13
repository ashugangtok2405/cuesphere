create table if not exists public.club_gallery_images (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

alter table public.club_gallery_images enable row level security;

create policy "gallery_select_public" on public.club_gallery_images
  for select using (true);

create policy "gallery_insert_staff" on public.club_gallery_images
  for insert with check (public.is_club_staff(club_id));

create policy "gallery_delete_staff" on public.club_gallery_images
  for delete using (public.is_club_staff(club_id));

insert into storage.buckets (id, name, public)
values ('club-gallery', 'club-gallery', true)
on conflict (id) do nothing;
