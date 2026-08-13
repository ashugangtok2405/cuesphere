import { Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LiveMatchView } from "@/features/live-match/types";

export function HighestBreakCard({ match }: { match: LiveMatchView }) {
  const { points, by, frame } = match.highestBreakInMatch;
  const name = by === "player1" ? match.player1.name : match.player2.name;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Highest Break in Match</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="font-tabular text-4xl font-bold text-primary">{points}</p>
          <p className="mt-1 text-sm text-foreground">By {name}</p>
          <p className="text-xs text-muted-foreground">In Frame {frame}</p>
        </div>
        <Trophy className="size-14 text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" strokeWidth={1.3} />
      </CardContent>
    </Card>
  );
}
