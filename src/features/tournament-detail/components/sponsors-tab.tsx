import { Card, CardContent } from "@/components/ui/card";
import type { TournamentDetail } from "@/types/tournament-detail";

export function SponsorsTab({ tournament }: { tournament: TournamentDetail }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tournament.sponsorNames.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-xl border border-border bg-background/40 px-4 py-8 text-center font-heading font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
