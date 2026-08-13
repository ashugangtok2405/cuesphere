"use server";

import { getSession } from "@/lib/auth/session";
import { getClubById, getMembership } from "@/services/club-service";
import { isStaffRole } from "@/types/club";
import { isTournamentScorekeeper } from "@/services/tournament-scorekeeper-service";
import { getMatchById, updateLiveProgress } from "@/services/match-service";
import { recordMatchResult } from "@/services/stats-service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { FrameScore } from "@/types/match";
import type { BallColor } from "@/features/live-match/components/ball-icon";

async function requireMatchStaff(matchId: string) {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "You must be logged in." };

  const match = await getMatchById(matchId);
  if (!match) return { ok: false as const, error: "Match not found." };

  const club = await getClubById(match.clubId);
  if (!club) return { ok: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role)) {
    const isScopedScorekeeper = await isTournamentScorekeeper(session.id, match.tournamentId);
    if (!isScopedScorekeeper) {
      return { ok: false as const, error: "You don't have permission to score this match." };
    }
  }

  return { ok: true as const, match };
}

/** Result Only mode: enter the final winner + score and complete the match in one step. */
export async function saveMatchResultAction(
  matchId: string,
  input: {
    winnerId: string;
    framesWonPlayer1: number;
    framesWonPlayer2: number;
    highestBreak: number;
    highestBreakPlayerId?: string;
  }
) {
  const check = await requireMatchStaff(matchId);
  if (!check.ok) return { success: false as const, error: check.error };

  if (input.winnerId !== check.match.player1Id && input.winnerId !== check.match.player2Id) {
    return { success: false as const, error: "Winner must be one of the two players." };
  }
  if (
    input.highestBreakPlayerId &&
    input.highestBreakPlayerId !== check.match.player1Id &&
    input.highestBreakPlayerId !== check.match.player2Id
  ) {
    return { success: false as const, error: "Highest break must belong to one of the two players." };
  }

  try {
    await recordMatchResult(check.match, input);
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Failed to save result." };
  }
  return { success: true as const };
}

/** Frame-by-Frame mode: save the running frame tally without completing the match yet. */
export async function saveMatchProgressAction(
  matchId: string,
  input: { framesWonPlayer1: number; framesWonPlayer2: number; frameScores?: FrameScore[] }
) {
  const check = await requireMatchStaff(matchId);
  if (!check.ok) return { success: false as const, error: check.error };

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("matches")
    .update({
      frames_won_player1: input.framesWonPlayer1,
      frames_won_player2: input.framesWonPlayer2,
      score: `${input.framesWonPlayer1} – ${input.framesWonPlayer2}`,
      ...(input.frameScores ? { frame_scores: input.frameScores } : {}),
    })
    .eq("id", matchId);

  if (error) return { success: false as const, error: error.message };
  return { success: true as const };
}

/** Live Score mode: persist the in-progress frame score + current break after every ball. */
export async function updateLiveProgressAction(
  matchId: string,
  input: {
    currentFrameScorePlayer1: number;
    currentFrameScorePlayer2: number;
    currentBreak: number;
    currentBreakBalls?: BallColor[];
    redsRemaining?: number;
    highestBreakSoFar?: number;
    highestBreakSoFarPlayerId?: string | null;
  }
) {
  const check = await requireMatchStaff(matchId);
  if (!check.ok) return { success: false as const, error: check.error };

  const { error } = await updateLiveProgress(matchId, input);
  if (error) return { success: false as const, error };
  return { success: true as const };
}

/** Frame-by-Frame / Live Score modes: finish the match from the current frame tally. */
export async function finishMatchAction(
  matchId: string,
  input: {
    framesWonPlayer1: number;
    framesWonPlayer2: number;
    highestBreak: number;
    highestBreakPlayerId?: string;
    frameScores?: FrameScore[];
  }
) {
  const check = await requireMatchStaff(matchId);
  if (!check.ok) return { success: false as const, error: check.error };

  if (input.framesWonPlayer1 === input.framesWonPlayer2) {
    return { success: false as const, error: "Frames can't be tied — someone must have more frames won." };
  }
  if (
    input.highestBreakPlayerId &&
    input.highestBreakPlayerId !== check.match.player1Id &&
    input.highestBreakPlayerId !== check.match.player2Id
  ) {
    return { success: false as const, error: "Highest break must belong to one of the two players." };
  }

  const winnerId =
    input.framesWonPlayer1 > input.framesWonPlayer2 ? check.match.player1Id : check.match.player2Id;

  try {
    await recordMatchResult(check.match, { winnerId, ...input });
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Failed to finish match." };
  }
  return { success: true as const };
}
