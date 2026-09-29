import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { getSession } from "@/lib/auth/session";
import { isTournamentScorekeeper } from "@/services/tournament-scorekeeper-service";
import { getClubTournamentBySlug } from "@/services/club-tournament-service";
import { getMatchById } from "@/services/match-service";
import { getProfileById } from "@/services/profile-service";
import { clubPath } from "@/lib/club-path";
import { MatchScoringView } from "@/features/club-admin/components/scoring/match-scoring-view";

export const metadata: Metadata = { title: "Score Match" };

export default async function ScoreMatchPage({
  params,
}: {
  params: Promise<{ clubSlug: string; slug: string; matchId: string }>;
}) {
  const { clubSlug, slug, matchId } = await params;
  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer) notFound();

  const tournament = await getClubTournamentBySlug(clubViewer.club.id, slug);
  if (!tournament) notFound();

  const backHref = clubViewer.isStaff ? clubPath(clubSlug, "/admin/live") : clubPath(clubSlug, "/scorekeeper");

  if (!clubViewer.isStaff) {
    const session = await getSession();
    const allowed = session ? await isTournamentScorekeeper(session.id, tournament.id) : false;
    if (!allowed) notFound();
  }

  const match = await getMatchById(matchId);
  if (!match || match.tournamentId !== tournament.id) notFound();

  const [player1Profile, player2Profile] = await Promise.all([
    getProfileById(match.player1Id),
    getProfileById(match.player2Id),
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:hidden"
      >
        <ChevronLeft className="size-4" /> Matches
      </Link>
      <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <Link href={clubPath(clubSlug, "/admin/tournaments")} className="hover:text-foreground">
          Tournaments
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={clubPath(clubSlug, `/admin/tournaments/${slug}`)}
          className="hover:text-foreground"
        >
          {tournament.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-primary">
          {match.player1Name} vs {match.player2Name}
        </span>
      </nav>

      <div>
        <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          {match.player1Name} vs {match.player2Name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tournament.name} &bull; {match.round} &bull; Table {match.tableNumber}
        </p>
      </div>

      <MatchScoringView
        match={match}
        player1PhotoUrl={player1Profile?.profilePhotoUrl}
        player2PhotoUrl={player2Profile?.profilePhotoUrl}
      />
    </div>
  );
}
