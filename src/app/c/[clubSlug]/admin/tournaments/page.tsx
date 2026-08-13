import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { listClubTournaments } from "@/services/club-tournament-service";
import { clubPath } from "@/lib/club-path";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CreateTournamentForm } from "@/features/club-admin/components/create-tournament-form";
import { isScorekeeperOnly } from "@/types/club";

export const metadata: Metadata = { title: "Tournaments" };

export default async function ClubAdminTournamentsPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer) return null;
  if (isScorekeeperOnly(clubViewer.membership?.role)) {
    redirect(clubPath(clubSlug, "/admin/live"));
  }

  const tournaments = await listClubTournaments(clubViewer.club.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Tournaments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create and manage tournaments for {clubViewer.club.name}.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {tournaments.length === 0 ? (
            <EmptyState
              icon={<Trophy className="size-6" />}
              title="No tournaments yet"
              description="Create your first tournament using the form on the right."
            />
          ) : (
            tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                    {tournament.imageUrl ? (
                      <Image
                        src={tournament.imageUrl}
                        alt={tournament.name}
                        width={44}
                        height={44}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Trophy className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tournament.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tournament.status} · {tournament.format} · Max {tournament.maxPlayers} players
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={clubPath(clubSlug, `/admin/tournaments/${tournament.slug}`)} />}
                >
                  Manage
                </Button>
              </div>
            ))
          )}
        </div>

        <CreateTournamentForm clubSlug={clubSlug} />
      </div>
    </div>
  );
}
