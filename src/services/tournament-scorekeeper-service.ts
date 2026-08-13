import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getClubTournamentById } from "@/services/club-tournament-service";
import { getClubById } from "@/services/club-service";

export interface ScorekeeperAssignment {
  tournamentId: string;
  tournamentSlug: string;
  tournamentName: string;
  clubId: string;
  clubSlug: string;
}

/** Returns this user's active tournament-scorekeeper assignment, or null if
 * they don't have one or the tournament they were assigned to has already
 * been marked completed — at which point their access simply stops working,
 * nothing needs to be revoked. */
export async function getActiveScorekeeperAssignment(userId: string): Promise<ScorekeeperAssignment | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_scorekeepers")
    .select("tournament_id, club_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;

  const [tournament, club] = await Promise.all([
    getClubTournamentById(data.tournament_id),
    getClubById(data.club_id),
  ]);
  if (!tournament || !club || tournament.status === "completed") return null;

  return {
    tournamentId: tournament.id,
    tournamentSlug: tournament.slug,
    tournamentName: tournament.name,
    clubId: club.id,
    clubSlug: club.slug,
  };
}

/** Is this user specifically the scorekeeper assigned to this tournament? */
export async function isTournamentScorekeeper(userId: string, tournamentId: string): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_scorekeepers")
    .select("id")
    .eq("user_id", userId)
    .eq("tournament_id", tournamentId)
    .maybeSingle();
  return !!data;
}

export async function listScorekeepersForTournament(
  tournamentId: string
): Promise<{ id: string; userId: string; createdAt: string }[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_scorekeepers")
    .select("id, user_id, created_at")
    .eq("tournament_id", tournamentId);
  return (data ?? []).map((row) => ({ id: row.id, userId: row.user_id, createdAt: row.created_at }));
}

export async function removeTournamentScorekeeper(id: string, clubId: string): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("tournament_scorekeepers")
    .delete()
    .eq("id", id)
    .eq("club_id", clubId);
  return { error: error?.message };
}
