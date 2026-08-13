"use client";

import { Radio } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveBadge } from "@/components/shared/live-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useClub } from "@/components/shared/club-provider";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import type { DrawMatch } from "@/types/match";

export function ClubLiveTab({
  matches,
  playerPhotos,
}: {
  matches: DrawMatch[];
  playerPhotos: Record<string, string>;
}) {
  const { basePath, club } = useClub();
  const liveMatches = matches.filter((m) => m.status === "live");

  if (liveMatches.length === 0) {
    return (
      <EmptyState
        icon={<Radio className="size-6" />}
        title="No matches live right now"
        description="Check back once the club admin starts a match for frame-by-frame live scoring."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {liveMatches.map((match) => (
        <Card key={match.id}>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {match.round} &bull; Table {match.tableNumber}
              </p>
              <LiveBadge />
            </div>
            <div className="flex items-center justify-between">
              <PlayerLink clubSlug={club.slug} playerId={match.player1Id} className="flex flex-col items-center gap-2 text-center hover:text-primary">
                <AvatarInitials name={match.player1Name} photoUrl={playerPhotos[match.player1Id]} size="md" />
                <span className="text-xs font-medium text-foreground">{match.player1Name}</span>
              </PlayerLink>
              <span className="text-sm font-bold text-muted-foreground">VS</span>
              <PlayerLink clubSlug={club.slug} playerId={match.player2Id} className="flex flex-col items-center gap-2 text-center hover:text-primary">
                <AvatarInitials name={match.player2Name} photoUrl={playerPhotos[match.player2Id]} size="md" />
                <span className="text-xs font-medium text-foreground">{match.player2Name}</span>
              </PlayerLink>
            </div>
            <LinkButton href={`${basePath}/live/${match.id}`} className="w-full">
              <Radio className="size-3.5" /> Watch Live
            </LinkButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
