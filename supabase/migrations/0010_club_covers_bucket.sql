insert into storage.buckets (id, name, public)
values ('club-covers', 'club-covers', true)
on conflict (id) do nothing;
