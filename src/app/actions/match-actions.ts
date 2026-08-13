"use server";

import { getSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/services/profile-service";
import { getMatchById } from "@/services/match-service";
import { recordMatchResult } from "@/services/stats-service";

/**
 * Demo-only trigger standing in for the future admin "record result" action.
 * Reports a result for the current player's own match.
 */
export async function simulateMatchResultAction(matchId: string, playerWon: boolean) {
  const session = await getSession();
  if (!session) {
    return { success: false as const, error: "You must be logged in." };
  }
  const profile = await getProfileByUserId(session.id);
  if (!profile) {
    return { success: false as const, error: "Profile not found." };
  }

  const match = await getMatchById(matchId);
  if (!match) {
    return { success: false as const, error: "Match not found." };
  }
  if (match.player1Id !== profile.id) {
    return { success: false as const, error: "You can only report your own match." };
  }

  const framesWonPlayer1 = playerWon ? 4 : Math.floor(Math.random() * 3);
  const framesWonPlayer2 = playerWon ? Math.floor(Math.random() * 3) : 4;
  const highestBreak = 30 + Math.floor(Math.random() * 70);

  const stats = await recordMatchResult(match, {
    winnerId: playerWon ? match.player1Id : match.player2Id,
    framesWonPlayer1,
    framesWonPlayer2,
    highestBreak,
  });

  return { success: true as const, stats };
}
