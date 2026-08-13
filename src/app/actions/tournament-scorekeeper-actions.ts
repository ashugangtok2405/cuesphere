"use server";

import { getSession } from "@/lib/auth/session";
import { getClubBySlug, getMembership } from "@/services/club-service";
import { getClubTournamentById } from "@/services/club-tournament-service";
import { isStaffRole, isScorekeeperOnly } from "@/types/club";
import { removeTournamentScorekeeper } from "@/services/tournament-scorekeeper-service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function requireTournamentManager(clubSlug: string, tournamentId: string) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "You must be logged in." };

  const club = await getClubBySlug(clubSlug);
  if (!club) return { ok: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role) || isScorekeeperOnly(membership?.role)) {
    return { ok: false as const, error: "You don't have permission to manage this club." };
  }

  const tournament = await getClubTournamentById(tournamentId);
  if (!tournament || tournament.clubId !== club.id) {
    return { ok: false as const, error: "Tournament not found." };
  }

  return { ok: true as const, club, tournament };
}

/** Creates a login scoped to scoring exactly one tournament. Access stops
 * working on its own once the tournament is marked completed — nothing to
 * revoke, no club-wide role granted. */
export async function createTournamentScorekeeperAction(
  clubSlug: string,
  tournamentId: string,
  input: { fullName: string; email: string; password: string }
) {
  const check = await requireTournamentManager(clubSlug, tournamentId);
  if (!check.ok) return { success: false as const, error: check.error };

  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  if (!fullName) return { success: false as const, error: "Enter a name." };
  if (!email) return { success: false as const, error: "Enter an email." };
  if (input.password.length < 8) {
    return { success: false as const, error: "Password must be at least 8 characters." };
  }

  const admin = createSupabaseAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    return {
      success: false as const,
      error: createError?.message ?? "Could not create the account. The email may already be in use.",
    };
  }

  const { error: assignError } = await admin.from("tournament_scorekeepers").insert({
    tournament_id: tournamentId,
    club_id: check.club.id,
    user_id: created.user.id,
  });
  if (assignError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false as const, error: assignError.message };
  }

  const memberId = `${check.tournament.slug.toUpperCase().slice(0, 10)}-SK`;
  await admin.from("player_profiles").insert({
    user_id: created.user.id,
    member_id: memberId,
    full_name: fullName,
    email,
  });

  return { success: true as const, email, password: input.password };
}

export async function removeTournamentScorekeeperAction(
  clubSlug: string,
  tournamentId: string,
  assignmentId: string
) {
  const check = await requireTournamentManager(clubSlug, tournamentId);
  if (!check.ok) return { success: false as const, error: check.error };

  const { error } = await removeTournamentScorekeeper(assignmentId, check.club.id);
  if (error) return { success: false as const, error };
  return { success: true as const };
}
