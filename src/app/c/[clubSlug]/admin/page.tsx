import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Trophy, Users } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { listClubTournaments } from "@/services/club-tournament-service";
import { listMembershipsForClub } from "@/services/club-service";
import { Card, CardContent } from "@/components/ui/card";
import { clubPath } from "@/lib/club-path";
import { isScorekeeperOnly } from "@/types/club";

export const metadata: Metadata = { title: "Club Admin" };

export default async function ClubAdminOverviewPage({
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

  const [tournaments, members] = await Promise.all([
    listClubTournaments(clubViewer.club.id),
    listMembershipsForClub(clubViewer.club.id),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A quick look at {clubViewer.club.name}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Trophy className="size-5" />
            </span>
            <div>
              <p className="font-tabular text-2xl font-bold text-foreground">{tournaments.length}</p>
              <p className="text-sm text-muted-foreground">Tournaments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="size-5" />
            </span>
            <div>
              <p className="font-tabular text-2xl font-bold text-foreground">{members.length}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
