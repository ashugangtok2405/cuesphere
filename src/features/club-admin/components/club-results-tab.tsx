import { ChevronDown, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import type { DrawMatch } from "@/types/match";

function groupByRound(matches: DrawMatch[]): [string, DrawMatch[]][] {
  const groups = new Map<string, DrawMatch[]>();
  for (const match of matches) {
    const group = groups.get(match.round) ?? [];
    group.push(match);
    groups.set(match.round, group);
  }
  return [...groups.entries()];
}

export function ClubResultsTab({
  clubSlug,
  matches,
  playerPhotos,
}: {
  clubSlug: string;
  matches: DrawMatch[];
  playerPhotos: Record<string, string>;
}) {
  const completed = matches.filter((m) => m.status === "completed");

  if (completed.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="size-6" />}
        title="No results yet"
        description="Completed match results will appear here as the tournament progresses."
      />
    );
  }

  const rounds = groupByRound(completed);

  return (
    <div className="space-y-6">
      {rounds.map(([round, roundMatches]) => (
        <Card key={round}>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide">{round}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {roundMatches.map((match) => {
              const hasFrames = match.frameScores.length > 0;
              return (
                <details key={match.id} className="group px-4 py-3 [&_summary]:list-none">
                  <summary
                    className={`flex flex-wrap items-center justify-between gap-3 ${hasFrames ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <PlayerLink
                        clubSlug={clubSlug}
                        playerId={match.player1Id}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        <AvatarInitials name={match.player1Name} photoUrl={playerPhotos[match.player1Id]} size="sm" />
                        {match.player1Name}
                      </PlayerLink>
                      <span className="text-muted-foreground">vs</span>
                      <PlayerLink
                        clubSlug={clubSlug}
                        playerId={match.player2Id}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        {match.player2Name}
                        <AvatarInitials name={match.player2Name} photoUrl={playerPhotos[match.player2Id]} size="sm" />
                      </PlayerLink>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-tabular font-bold text-primary">
                        {match.score ?? `${match.framesWonPlayer1} - ${match.framesWonPlayer2}`}
                      </span>
                      {hasFrames ? (
                        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                      ) : null}
                    </div>
                  </summary>

                  {hasFrames ? (
                    <div className="mt-3 space-y-1.5 rounded-lg border border-border bg-background/40 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Frame-by-frame
                      </p>
                      {match.frameScores.map((frame) => (
                        <div key={frame.frame} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Frame {frame.frame}</span>
                          <span className="font-tabular font-semibold text-foreground">
                            {frame.player1Score} – {frame.player2Score}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </details>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
