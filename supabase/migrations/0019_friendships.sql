-- Mutual friendships between players, platform-wide (not club-scoped).
-- A row starts "pending" (sent by requester_id) and becomes "accepted" once
-- recipient_id confirms, or "declined" if they reject it. Used to power the
-- player directory's connect flow and "friends registered" on tournaments.
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users (id) on delete cascade,
  recipient_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_no_self_friend check (requester_id <> recipient_id),
  constraint friendships_unique_pair unique (requester_id, recipient_id)
);

create index if not exists friendships_recipient_idx on public.friendships (recipient_id, status);
create index if not exists friendships_requester_idx on public.friendships (requester_id, status);

alter table public.friendships enable row level security;

create policy "friendships_select_own" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "friendships_insert_own" on public.friendships
  for insert with check (auth.uid() = requester_id);

create policy "friendships_update_own" on public.friendships
  for update using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "friendships_delete_own" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = recipient_id);
