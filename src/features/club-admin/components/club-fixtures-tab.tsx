import { CalendarClock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import type { DrawMatch } from "@/types/match";

export function ClubFixturesTab({
  clubSlug,
  matches,
  playerPhotos,
}: {
  clubSlug: string;
  matches: DrawMatch[];
  playerPhotos: Record<string, string>;
}) {
  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<CalendarClock className="size-6" />}
        title="Fixtures not drawn yet"
        description="The club admin will draw fixtures and assign tables once registration closes."
      />
    );
  }

  const grouped = matches.reduce<Record<string, DrawMatch[]>>((acc, match) => {
    (acc[match.round] ??= []).push(match);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([round, roundMatches]) => (
        <Card key={round}>
          <CardContent className="pt-6">
            <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              {round}
            </h3>
            <div className="space-y-2">
              {roundMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">Table {match.tableNumber}</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <PlayerLink clubSlug={clubSlug} playerId={match.player1Id} className="flex items-center gap-2 hover:text-primary">
                      <AvatarInitials name={match.player1Name} photoUrl={playerPhotos[match.player1Id]} size="sm" />
                      {match.player1Name}
                    </PlayerLink>
                    <span className="text-muted-foreground">vs</span>
                    <PlayerLink clubSlug={clubSlug} playerId={match.player2Id} className="flex items-center gap-2 hover:text-primary">
                      {match.player2Name}
                      <AvatarInitials name={match.player2Name} photoUrl={playerPhotos[match.player2Id]} size="sm" />
                    </PlayerLink>
                  </span>
                  <div className="flex items-center gap-3">
                    {match.score ? (
                      <span className="font-tabular text-sm font-bold text-primary">{match.score}</span>
                    ) : null}
                    <StatusBadge
                      status={
                        match.status === "completed"
                          ? "completed"
                          : match.status === "live"
                            ? "live"
                            : "upcoming"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
