-- Which player is at the table during live scoring (1 or 2), so the table TV
-- and the stream overlay can highlight them.
alter table public.matches
  add column if not exists current_player smallint check (current_player in (1, 2));
