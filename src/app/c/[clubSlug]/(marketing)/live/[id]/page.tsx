import type { Metadata } from "next";
import { Radio } from "lucide-react";

import { getMatchById, getHeadToHead } from "@/services/match-service";
import { getClubBySlug } from "@/services/club-service";
import { getClubTournamentById } from "@/services/club-tournament-service";
import { getProfileById } from "@/services/profile-service";
import { getStatsForPlayer } from "@/services/stats-service";
import { MOCK_LIVE_MATCH } from "@/lib/mock/live-match";
import { LiveMatchCentre } from "@/features/live-match/components/live-match-centre";
import { LiveAutoRefresh } from "@/features/live-match/components/live-auto-refresh";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";
import type { LiveMatchView, FrameResult } from "@/features/live-match/types";
import type { BallColor } from "@/features/live-match/components/ball-icon";
import type { DrawMatch } from "@/types/match";
import type { ClubTournament } from "@/types/club-tournament";

const SAMPLE_BALLS: BallColor[] = ["red", "yellow", "green", "brown", "blue", "pink", "black"];

export const metadata: Metadata = { title: "Live Match Centre" };

function buildFrameHistory(match: DrawMatch, bestOf: number): FrameResult[] {
  const played: FrameResult[] = match.frameScores.map((frame) => ({
    frame: frame.frame,
    player1: frame.player1Score,
    player2: frame.player2Score,
    winner: frame.player1Score === frame.player2Score ? null : frame.player1Score > frame.player2Score ? "player1" : "player2",
  }));

  const padded = [...played];
  for (let frame = played.length + 1; frame <= bestOf; frame++) {
    padded.push({ frame, player1: null, player2: null, winner: null });
  }
  return padded;
}

function winRate(stats: { matchesPlayed: number; wins: number } | undefined): number {
  if (!stats || stats.matchesPlayed === 0) return 0;
  return Math.round((stats.wins / stats.matchesPlayed) * 100);
}

function buildView(
  match: DrawMatch,
  tournament: ClubTournament | undefined,
  photos: { player1?: string; player2?: string },
  headToHead: { player1Wins: number; player2Wins: number },
  playerStats: { player1?: Awaited<ReturnType<typeof getStatsForPlayer>>; player2?: Awaited<ReturnType<typeof getStatsForPlayer>> }
): LiveMatchView {
  const bestOf = tournament?.bestOf ?? 7;
  const framesToWin = Math.ceil(bestOf / 2);
  const framesPlayed = match.framesWonPlayer1 + match.framesWonPlayer2;
  const isPlayer1Break = match.highestBreakPlayerId === match.player1Id;

  return {
    tournamentName: tournament?.name ?? "Tournament",
    round: match.round,
    tableLabel: `Table ${match.tableNumber}`,
    isLive: match.status === "live" || match.status === "scheduled",
    bestOf,
    referee: "",
    startedAt: match.matchStartTime,
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: match.matchStartTime,
    player1: {
      name: match.player1Name,
      country: "IN",
      framesWon: match.framesWonPlayer1,
      points: match.currentFrameScorePlayer1,
      photoUrl: photos.player1,
    },
    player2: {
      name: match.player2Name,
      country: "IN",
      framesWon: match.framesWonPlayer2,
      points: match.currentFrameScorePlayer2,
      photoUrl: photos.player2,
    },
    currentFrameNumber: Math.min(framesPlayed + 1, bestOf),
    currentBreak: {
      points: match.currentBreak,
      owner: match.currentFrameScorePlayer1 >= match.currentFrameScorePlayer2 ? "player1" : "player2",
      balls: match.currentBreakBalls,
    },
    frameHistory: buildFrameHistory(match, bestOf),
    ballsOnTable: SAMPLE_BALLS,
    redsRemaining: match.redsRemaining,
    matchStatus: match.status === "completed" ? "Completed" : "In Progress",
    nextFrameCountdownSeconds: null,
    remainingFrames: Math.max(0, framesToWin - Math.max(match.framesWonPlayer1, match.framesWonPlayer2)),
    commentary: [],
    headToHead,
    seasonStats: {
      player1: {
        matches: playerStats.player1?.matchesPlayed ?? 0,
        wins: playerStats.player1?.wins ?? 0,
        winRate: winRate(playerStats.player1),
        highestBreak: playerStats.player1?.highestBreak ?? 0,
      },
      player2: {
        matches: playerStats.player2?.matchesPlayed ?? 0,
        wins: playerStats.player2?.wins ?? 0,
        winRate: winRate(playerStats.player2),
        highestBreak: playerStats.player2?.highestBreak ?? 0,
      },
    },
    highestBreakInMatch: {
      points: match.highestBreak || 0,
      by: isPlayer1Break ? "player1" : "player2",
      frame: 1,
    },
    nextMatch: null,
  };
}

export default async function LiveMatchPage({
  params,
}: {
  params: Promise<{ clubSlug: string; id: string }>;
}) {
  const { clubSlug, id } = await params;
  const match = await getMatchById(id);
  const tournament = match ? await getClubTournamentById(match.tournamentId) : undefined;
  const [player1Profile, player2Profile, headToHead, player1Stats, player2Stats] = match
    ? await Promise.all([
        getProfileById(match.player1Id),
        getProfileById(match.player2Id),
        getHeadToHead(match.clubId, match.player1Id, match.player2Id),
        getStatsForPlayer(match.player1Id, match.clubId),
        getStatsForPlayer(match.player2Id, match.clubId),
      ])
    : [undefined, undefined, { player1Wins: 0, player2Wins: 0 }, undefined, undefined];
  const photos = { player1: player1Profile?.profilePhotoUrl, player2: player2Profile?.profilePhotoUrl };
  const playerStats = { player1: player1Stats, player2: player2Stats };

  // XYZ Snooker Club keeps its original, always-on demo live match — it
  // falls back to mock data when the requested match isn't real.
  if (clubSlug === "xyz-snooker-club") {
    const view = match ? buildView(match, tournament, photos, headToHead, playerStats) : MOCK_LIVE_MATCH;
    return <LiveMatchCentre match={view} clubSlug={clubSlug} />;
  }

  const club = await getClubBySlug(clubSlug);
  if (!club) return null;

  if (match && match.clubId === club.id && match.status === "live") {
    return (
      <>
        <LiveAutoRefresh />
        <LiveMatchCentre match={buildView(match, tournament, photos, headToHead, playerStats)} clubSlug={clubSlug} />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Live Matches"
        description={`Follow live scoring from ${club.name}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Live Matches" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          icon={<Radio className="size-6" />}
          title="No live match right now"
          description={`${club.name} doesn't have a match in progress at the moment. Check back once a tournament is underway.`}
        />
      </div>
    </>
  );
}
