import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { clubPath } from "@/lib/club-path";
import { MatchScoreCard } from "@/features/live-match/components/match-score-card";
import { TableViewCard } from "@/features/live-match/components/table-view-card";
import { FrameHistoryCard } from "@/features/live-match/components/frame-history-card";
import { CurrentFrameCard } from "@/features/live-match/components/current-frame-card";
import { MatchInfoCard } from "@/features/live-match/components/match-info-card";
import { HeadToHeadCard } from "@/features/live-match/components/head-to-head-card";
import { SeasonStatsCard } from "@/features/live-match/components/season-stats-card";
import { HighestBreakCard } from "@/features/live-match/components/highest-break-card";
import { NextMatchCard } from "@/features/live-match/components/next-match-card";
import type { LiveMatchView } from "@/features/live-match/types";

export type { LiveMatchView };

export function LiveMatchCentre({
  match,
  clubSlug,
}: {
  match: LiveMatchView;
  clubSlug: string;
}) {
  const now = Date.now();
  const startedAtMs = now - (18 * 60 + 25) * 1000;
  const nextFrameCountdownStartMs = match.nextFrameCountdownSeconds
    ? now + match.nextFrameCountdownSeconds * 1000
    : now;

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={clubPath(clubSlug)} className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={clubPath(clubSlug, "/live")} className="hover:text-foreground">
          Live Matches
        </Link>
        <ChevronRight className="size-3.5" />
        <span>{match.tournamentName}</span>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-primary">{match.tableLabel}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-2">
        <MatchScoreCard match={match} startedAtMs={startedAtMs} />
        <TableViewCard match={match} nextFrameCountdownStartMs={nextFrameCountdownStartMs} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <FrameHistoryCard match={match} />
        <CurrentFrameCard match={match} frameStartMs={startedAtMs} />
        <MatchInfoCard match={match} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <HeadToHeadCard match={match} />
        <SeasonStatsCard match={match} />
        <HighestBreakCard match={match} />
        <NextMatchCard match={match} />
      </div>
    </div>
  );
}
