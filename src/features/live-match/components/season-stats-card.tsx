import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import type { LiveMatchView } from "@/features/live-match/types";

function PlayerStatBlock({
  name,
  photoUrl,
  stats,
}: {
  name: string;
  photoUrl?: string;
  stats: { matches: number; wins: number; winRate: number; highestBreak: number };
}) {
  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <AvatarInitials name={name} photoUrl={photoUrl} size="sm" />
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>
      <div className="grid grid-cols-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Matches</span>
        <span className="text-right font-tabular font-medium text-foreground">{stats.matches}</span>
        <span className="text-muted-foreground">Wins</span>
        <span className="text-right font-tabular font-medium text-foreground">{stats.wins}</span>
        <span className="text-muted-foreground">Win Rate</span>
        <span className="text-right font-tabular font-medium text-foreground">{stats.winRate}%</span>
        <span className="text-muted-foreground">Highest Break</span>
        <span className="text-right font-tabular font-medium text-primary">{stats.highestBreak}</span>
      </div>
    </div>
  );
}

export function SeasonStatsCard({ match }: { match: LiveMatchView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Club Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <PlayerStatBlock name={match.player1.name} photoUrl={match.player1.photoUrl} stats={match.seasonStats.player1} />
        <div className="w-px shrink-0 bg-border" />
        <PlayerStatBlock name={match.player2.name} photoUrl={match.player2.photoUrl} stats={match.seasonStats.player2} />
      </CardContent>
    </Card>
  );
}
