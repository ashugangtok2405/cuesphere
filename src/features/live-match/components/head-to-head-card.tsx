import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LiveMatchView } from "@/features/live-match/types";

export function HeadToHeadCard({ match }: { match: LiveMatchView }) {
  const { player1Wins, player2Wins } = match.headToHead;
  const total = player1Wins + player2Wins;
  const player1Percent = total === 0 ? 50 : (player1Wins / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Head to Head</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{match.player1.name}</p>
          <p className="font-tabular text-lg font-bold text-success">{player1Wins} Wins</p>
        </div>

        <div
          className="relative flex size-24 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--success) 0% ${player1Percent}%, var(--destructive) ${player1Percent}% 100%)`,
          }}
        >
          <div className="flex size-16 flex-col items-center justify-center rounded-full bg-card text-center">
            <span className="font-tabular text-lg font-bold text-foreground">{total}</span>
            <span className="text-[9px] uppercase leading-tight text-muted-foreground">
              Matches
              <br />
              Played
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{match.player2.name}</p>
          <p className="font-tabular text-lg font-bold text-destructive">{player2Wins} Wins</p>
        </div>
      </CardContent>
    </Card>
  );
}
