"use server";

import { getSession } from "@/lib/auth/session";
import { getRegisteredPlayerIds } from "@/services/registration-service";
import { publishDraw } from "@/services/match-service";

/**
 * Demo-only trigger standing in for the future admin "publish draw" action.
 * Pairs every current registrant for the tournament against a mock opponent.
 */
export async function publishDrawAction(clubId: string, tournamentId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false as const, error: "You must be logged in." };
  }

  const registeredPlayerIds = await getRegisteredPlayerIds(tournamentId);

  if (registeredPlayerIds.length === 0) {
    return { success: false as const, error: "No registered players to draw." };
  }

  const matches = await publishDraw(clubId, tournamentId, registeredPlayerIds);
  return { success: true as const, matchCount: matches.length };
}
