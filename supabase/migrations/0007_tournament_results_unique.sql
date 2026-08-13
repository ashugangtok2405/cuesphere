-- Prevent duplicate tournament_results rows for the same player+tournament,
-- which previously let redrawing a completed round's fixtures double-count stats.
delete from public.tournament_results a
  using public.tournament_results b
  where a.id > b.id
    and a.tournament_id = b.tournament_id
    and a.player_id = b.player_id;

alter table public.tournament_results
  add constraint tournament_results_tournament_player_unique unique (tournament_id, player_id);
