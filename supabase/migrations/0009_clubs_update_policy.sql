-- clubs had a select policy but no update policy, so club-settings saves
-- from the authenticated (non-admin) client were silently dropped by RLS.
create policy "clubs_update_staff" on public.clubs
  for update using (public.is_club_staff(id));
