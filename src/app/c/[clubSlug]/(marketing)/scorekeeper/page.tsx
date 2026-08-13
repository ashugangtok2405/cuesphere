import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Radio } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { getActiveScorekeeperAssignment } from "@/services/tournament-scorekeeper-service";
import { getMatchesForTournament } from "@/services/match-service";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LiveBadge } from "@/components/shared/live-badge";
import { MatchStatusControl } from "@/features/club-admin/components/match-status-control";
import { clubPath } from "@/lib/club-path";

export const metadata: Metadata = { title: "Score Matches" };

export default async function ScorekeeperPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const session = await getSession();
  if (!session) notFound();

  const assignment = await getActiveScorekeeperAssignment(session.id);
  if (!assignment || assignment.clubSlug !== clubSlug) notFound();

  const matches = (await getMatchesForTournament(assignment.tournamentId)).filter(
    (m) => m.status === "scheduled" || m.status === "live"
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">{assignment.tournamentName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You can score matches for this tournament only. Access ends once it's marked completed.
      </p>

      <div className="mt-8 space-y-3">
        {matches.length === 0 ? (
          <EmptyState
            icon={<Radio className="size-6" />}
            title="Nothing to score right now"
            description="Once a match is scheduled and marked live, it'll show up here."
          />
        ) : (
          matches.map((match) => (
            <Card key={match.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {match.player1Name} vs {match.player2Name}
                    {match.status === "live" ? <LiveBadge /> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {match.round} &bull; Table {match.tableNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MatchStatusControl clubSlug={clubSlug} matchId={match.id} status={match.status} />
                  <Link
                    href={clubPath(clubSlug, `/admin/tournaments/${assignment.tournamentSlug}/matches/${match.id}`)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Score Match
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
