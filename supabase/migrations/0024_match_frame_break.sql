-- True between the referee ending a frame and starting the next one, so the
-- table TV and stream overlay can play the club's ads during the break.
alter table public.matches
  add column if not exists in_frame_break boolean not null default false;
