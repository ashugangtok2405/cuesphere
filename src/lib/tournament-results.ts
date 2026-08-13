import type { DrawMatch } from "@/types/match";

export interface TournamentResultPlayer {
  id: string;
  name: string;
}

export interface TournamentResults {
  champion: TournamentResultPlayer | null;
  runnerUp: TournamentResultPlayer | null;
  semifinalists: TournamentResultPlayer[];
}

/**
 * Reads the champion / runner-up / semifinalists from completed matches by
 * matching round names the admin chose (e.g. "Finals", "Semi Finals").
 * Returns nulls/[] wherever a round can't be identified or hasn't finished —
 * this never fabricates a result.
 */
export function computeTournamentResults(matches: DrawMatch[]): TournamentResults {
  const finalRound = matches.find(
    (m) => /final/i.test(m.round) && !/semi/i.test(m.round) && !/quarter/i.test(m.round)
  );
  const finalMatch = finalRound
    ? matches.find(
        (m) => m.round === finalRound.round && m.status === "completed" && m.winnerId
      )
    : undefined;

  let champion: TournamentResultPlayer | null = null;
  let runnerUp: TournamentResultPlayer | null = null;
  if (finalMatch) {
    const isPlayer1Winner = finalMatch.winnerId === finalMatch.player1Id;
    champion = {
      id: finalMatch.winnerId as string,
      name: isPlayer1Winner ? finalMatch.player1Name : finalMatch.player2Name,
    };
    runnerUp = {
      id: isPlayer1Winner ? finalMatch.player2Id : finalMatch.player1Id,
      name: isPlayer1Winner ? finalMatch.player2Name : finalMatch.player1Name,
    };
  }

  const semiRoundName = matches.find((m) => /semi/i.test(m.round))?.round;
  const semifinalists: TournamentResultPlayer[] = semiRoundName
    ? matches
        .filter((m) => m.round === semiRoundName && m.status === "completed" && m.winnerId)
        .map((m) => {
          const loserIsPlayer1 = m.winnerId !== m.player1Id;
          return {
            id: loserIsPlayer1 ? m.player1Id : m.player2Id,
            name: loserIsPlayer1 ? m.player1Name : m.player2Name,
          };
        })
    : [];

  return { champion, runnerUp, semifinalists };
}
