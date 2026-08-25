-- Lets a club admin/staff manually mark whether a player's entry fee has
-- been paid, independent of the online/offline payment records (those only
-- exist for the legacy demo checkout flow — real club tournaments collect
-- fees in person, so organizers need a manual paid/pending toggle here).
alter table public.tournament_registrations
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed'));
