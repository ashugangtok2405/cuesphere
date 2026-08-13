import { CalendarClock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { TournamentDetail } from "@/types/tournament-detail";

export function FixturesTab({ tournament }: { tournament: TournamentDetail }) {
  if (tournament.fixtures.length === 0) {
    return (
      <EmptyState
        icon={<CalendarClock className="size-6" />}
        title="Fixtures not generated yet"
        description="The bracket will be published once registration closes."
      />
    );
  }

  const grouped = tournament.fixtures.reduce<Record<string, typeof tournament.fixtures>>((acc, fixture) => {
    (acc[fixture.round] ??= []).push(fixture);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([round, fixtures]) => (
        <Card key={round}>
          <CardContent className="pt-6">
            <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              {round}
            </h3>
            <div className="space-y-2">
              {fixtures.map((fixture, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{fixture.table}</span>
                  <span className="text-sm font-medium text-foreground">
                    {fixture.players[0]} <span className="text-muted-foreground">vs</span>{" "}
                    {fixture.players[1]}
                  </span>
                  <div className="flex items-center gap-3">
                    {fixture.score ? (
                      <span className="font-tabular text-sm font-bold text-primary">{fixture.score}</span>
                    ) : null}
                    <StatusBadge
                      status={
                        fixture.status === "completed"
                          ? "completed"
                          : fixture.status === "live"
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
