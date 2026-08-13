import { Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import type { PlayerProfile } from "@/types/player-profile";
import type { TournamentRegistration } from "@/types/registration";

export function ClubPlayersTab({
  clubSlug,
  players,
}: {
  clubSlug: string;
  players: { registration: TournamentRegistration; profile: PlayerProfile | undefined }[];
}) {
  if (players.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="No registrations yet"
        description="Registered players will appear here once players sign up."
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map(({ registration, profile }, i) => (
              <TableRow key={registration.id}>
                <TableCell className="font-tabular text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">
                  {profile ? (
                    <PlayerLink
                      clubSlug={clubSlug}
                      playerId={profile.id}
                      className="flex items-center gap-2.5 hover:text-primary"
                    >
                      <AvatarInitials name={profile.fullName || "Unknown Player"} photoUrl={profile.profilePhotoUrl} size="sm" />
                      {profile.fullName || "Unknown Player"}
                    </PlayerLink>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <AvatarInitials name="Unknown Player" size="sm" />
                      Unknown Player
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{profile?.memberId ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={registration.status === "confirmed" ? "default" : "secondary"}>
                    {registration.status === "confirmed" ? "Confirmed" : "Pending Approval"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
