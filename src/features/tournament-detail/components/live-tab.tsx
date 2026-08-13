"use client";

import { Radio } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveBadge } from "@/components/shared/live-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useClub } from "@/components/shared/club-provider";
import type { TournamentDetail } from "@/types/tournament-detail";

export function LiveTab({ tournament }: { tournament: TournamentDetail }) {
  const { basePath } = useClub();
  const liveFixtures = tournament.fixtures.filter((f) => f.status === "live");

  if (liveFixtures.length === 0) {
    return (
      <EmptyState
        icon={<Radio className="size-6" />}
        title="No matches live right now"
        description="Check back during the tournament for live frame-by-frame scoring."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {liveFixtures.map((fixture, i) => (
        <Card key={i}>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {fixture.round} &bull; {fixture.table}
              </p>
              <LiveBadge />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 text-center">
                <AvatarInitials name={fixture.players[0]} size="md" />
                <span className="text-xs font-medium text-foreground">{fixture.players[0]}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">VS</span>
              <div className="flex flex-col items-center gap-2 text-center">
                <AvatarInitials name={fixture.players[1]} size="md" />
                <span className="text-xs font-medium text-foreground">{fixture.players[1]}</span>
              </div>
            </div>
            <LinkButton href={`${basePath}/live/table-2`} className="w-full">
              <Radio className="size-3.5" /> Watch Live
            </LinkButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
