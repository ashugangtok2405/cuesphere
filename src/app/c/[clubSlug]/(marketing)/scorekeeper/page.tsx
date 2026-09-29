import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Radio } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { getActiveScorekeeperAssignment } from "@/services/tournament-scorekeeper-service";
import { getMatchesForTournament } from "@/services/match-service";
import { EmptyState } from "@/components/shared/empty-state";
import { ScorableMatchCard } from "@/features/club-admin/components/scorable-match-card";
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

  const matches = (await getMatchesForTournament(assignment.tournamentId))
    .filter((m) => m.status === "scheduled" || m.status === "live")
    .sort((a, b) => a.tableNumber - b.tableNumber);
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "scheduled");

  const card = (match: (typeof matches)[number]) => (
    <ScorableMatchCard
      key={match.id}
      match={match}
      clubSlug={clubSlug}
      context={`${assignment.tournamentName} · ${match.round}`}
      scoreHref={clubPath(clubSlug, `/admin/tournaments/${assignment.tournamentSlug}/matches/${match.id}`)}
    />
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">{assignment.tournamentName}</h1>
      <p className="mt-2 rounded-xl bg-info-soft px-3.5 py-2.5 text-sm text-info">
        You can score matches for this tournament only. Access ends once it&apos;s marked completed.
      </p>

      {matches.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Radio className="size-6" />}
            title="Nothing to score right now"
            description="Once a match is scheduled and marked live, it'll show up here."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {live.length > 0 ? (
            <section className="space-y-3">
              <h2 className="font-heading text-lg font-bold text-foreground">Now</h2>
              {live.map(card)}
            </section>
          ) : null}
          {upcoming.length > 0 ? (
            <section className="space-y-3">
              <h2 className="font-heading text-lg font-bold text-foreground">Up next</h2>
              {upcoming.map(card)}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
