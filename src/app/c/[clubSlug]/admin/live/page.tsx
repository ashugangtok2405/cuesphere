import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Radio } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { getScorableMatchesForClub } from "@/services/match-service";
import { getClubTournamentById } from "@/services/club-tournament-service";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LiveBadge } from "@/components/shared/live-badge";
import { MatchStatusControl } from "@/features/club-admin/components/match-status-control";
import { clubPath } from "@/lib/club-path";

export const metadata: Metadata = { title: "Live Scoring" };

export default async function AdminLiveScoringPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer || !clubViewer.isStaff) notFound();

  const matches = await getScorableMatchesForClub(clubViewer.club.id);
  const withTournament = await Promise.all(
    matches.map(async (match) => ({
      match,
      tournament: await getClubTournamentById(match.tournamentId),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Live Scoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every match that's live or waiting to start, across all tournaments.
        </p>
      </div>

      {withTournament.length === 0 ? (
        <EmptyState
          icon={<Radio className="size-6" />}
          title="Nothing to score right now"
          description="Once a match is scheduled and marked live, it'll show up here."
        />
      ) : (
        <div className="space-y-3">
          {withTournament.map(({ match, tournament }) => (
            <Card key={match.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {match.player1Name} vs {match.player2Name}
                    {match.status === "live" ? <LiveBadge /> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tournament?.name ?? "Tournament"} &bull; {match.round} &bull; Table {match.tableNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MatchStatusControl clubSlug={clubSlug} matchId={match.id} status={match.status} />
                  {tournament ? (
                    <Link
                      href={clubPath(clubSlug, `/admin/tournaments/${tournament.slug}/matches/${match.id}`)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Score Match
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
