import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Achievement, PlayerStatistics } from "@/types/player-stats";
import type { DrawMatch, FrameScore } from "@/types/match";

interface StatsRow {
  player_id: string;
  club_id: string;
  tournaments_played: number;
  matches_played: number;
  wins: number;
  losses: number;
  frames_won: number;
  frames_lost: number;
  highest_break: number;
  ranking_points: number;
  prize_money: number;
  recent_form: string[];
}

function fromRow(row: StatsRow): PlayerStatistics {
  return {
    playerId: row.player_id,
    clubId: row.club_id,
    tournamentsPlayed: row.tournaments_played,
    matchesPlayed: row.matches_played,
    wins: row.wins,
    losses: row.losses,
    framesWon: row.frames_won,
    framesLost: row.frames_lost,
    highestBreak: row.highest_break,
    rankingPoints: row.ranking_points,
    prizeMoney: row.prize_money,
    recentForm: row.recent_form as ("W" | "L")[],
  };
}

export async function getStatsForPlayer(
  playerId: string,
  clubId: string
): Promise<PlayerStatistics | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("player_statistics")
    .select("*")
    .eq("player_id", playerId)
    .eq("club_id", clubId)
    .maybeSingle();
  return data ? fromRow(data as StatsRow) : undefined;
}

export async function getAchievementsForPlayer(playerId: string, clubId: string): Promise<Achievement[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("achievements")
    .select("*")
    .eq("player_id", playerId)
    .eq("club_id", clubId);
  return (
    (
      data as
        | {
            id: string;
            player_id: string;
            club_id: string;
            title: string;
            description: string;
            date_awarded: string;
            icon: Achievement["icon"];
          }[]
        | null
    )?.map((row) => ({
      id: row.id,
      playerId: row.player_id,
      clubId: row.club_id,
      title: row.title,
      description: row.description,
      dateAwarded: row.date_awarded,
      icon: row.icon,
    })) ?? []
  );
}

async function awardAchievement(
  playerId: string,
  clubId: string,
  achievement: Omit<Achievement, "id" | "playerId" | "clubId">
) {
  const admin = createSupabaseAdminClient();
  await admin.from("achievements").insert({
    player_id: playerId,
    club_id: clubId,
    title: achievement.title,
    description: achievement.description,
    date_awarded: achievement.dateAwarded,
    icon: achievement.icon,
  });
}

/**
 * Stand-in for the future admin "record match result" action. Completes the
 * given match, updates the winning/losing player's statistics, records the
 * tournament result and checks for newly-earned achievements.
 */
export async function recordMatchResult(
  match: DrawMatch,
  input: {
    winnerId: string;
    framesWonPlayer1: number;
    framesWonPlayer2: number;
    highestBreak: number;
    highestBreakPlayerId?: string;
    frameScores?: FrameScore[];
  }
): Promise<PlayerStatistics> {
  const admin = createSupabaseAdminClient();
  const clubId = match.clubId;
  const highestBreakOwnerId = input.highestBreakPlayerId ?? input.winnerId;

  const { error: matchUpdateError } = await admin
    .from("matches")
    .update({
      status: "completed",
      winner_id: input.winnerId,
      frames_won_player1: input.framesWonPlayer1,
      frames_won_player2: input.framesWonPlayer2,
      score: `${input.framesWonPlayer1} – ${input.framesWonPlayer2}`,
      highest_break: input.highestBreak,
      highest_break_player_id: highestBreakOwnerId,
      ...(input.frameScores ? { frame_scores: input.frameScores } : {}),
    })
    .eq("id", match.id);

  if (matchUpdateError) {
    throw new Error(matchUpdateError.message);
  }

  async function applyResultFor(playerId: string, won: boolean, framesWon: number, framesLost: number) {
    const { data: existing } = await admin
      .from("player_statistics")
      .select("*")
      .eq("player_id", playerId)
      .eq("club_id", clubId)
      .maybeSingle();

    const current: StatsRow =
      (existing as StatsRow | null) ?? {
        player_id: playerId,
        club_id: clubId,
        tournaments_played: 0,
        matches_played: 0,
        wins: 0,
        losses: 0,
        frames_won: 0,
        frames_lost: 0,
        highest_break: 0,
        ranking_points: 0,
        prize_money: 0,
        recent_form: [],
      };

    const { data: existingResult } = await admin
      .from("tournament_results")
      .select("id")
      .eq("tournament_id", match.tournamentId)
      .eq("player_id", playerId)
      .maybeSingle();
    const isFirstMatchInTournament = !existingResult;

    const isHighestBreakOwner = playerId === highestBreakOwnerId;
    const formEntry = won ? "W" : "L";
    const updated: StatsRow = {
      ...current,
      tournaments_played: current.tournaments_played + (isFirstMatchInTournament ? 1 : 0),
      matches_played: current.matches_played + 1,
      wins: current.wins + (won ? 1 : 0),
      losses: current.losses + (won ? 0 : 1),
      frames_won: current.frames_won + framesWon,
      frames_lost: current.frames_lost + framesLost,
      highest_break: isHighestBreakOwner
        ? Math.max(current.highest_break, input.highestBreak)
        : current.highest_break,
      ranking_points: current.ranking_points + (won ? 50 : 10),
      recent_form: [...current.recent_form, formEntry].slice(-10),
    };

    await admin.from("player_statistics").upsert(updated);

    await admin.from("tournament_results").upsert(
      {
        club_id: clubId,
        tournament_id: match.tournamentId,
        player_id: playerId,
        position: won ? 32 : 64,
        prize_money: 0,
      },
      { onConflict: "tournament_id,player_id" }
    );

    if (won && current.wins === 0) {
      await awardAchievement(playerId, clubId, {
        title: "First Win",
        description: "Won your first competitive match at this club.",
        dateAwarded: new Date().toISOString(),
        icon: "star",
      });
    }
    if (isHighestBreakOwner && input.highestBreak >= 50) {
      await awardAchievement(playerId, clubId, {
        title: "Half-Century Break",
        description: `Compiled a break of ${input.highestBreak} in competitive play.`,
        dateAwarded: new Date().toISOString(),
        icon: "flame",
      });
    }

    return updated;
  }

  const isPlayer1Winner = input.winnerId === match.player1Id;
  const [player1Stats, player2Stats] = await Promise.all([
    applyResultFor(
      match.player1Id,
      isPlayer1Winner,
      input.framesWonPlayer1,
      input.framesWonPlayer2
    ),
    applyResultFor(
      match.player2Id,
      !isPlayer1Winner,
      input.framesWonPlayer2,
      input.framesWonPlayer1
    ),
  ]);

  return fromRow(isPlayer1Winner ? player1Stats : player2Stats);
}
