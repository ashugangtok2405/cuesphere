import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LiveMatchView } from "@/features/live-match/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export function MatchInfoCard({ match }: { match: LiveMatchView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Match Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Row label="Tournament" value={match.tournamentName} />
        <Row label="Round" value={match.round} />
        <Row label="Table" value={match.tableLabel} />
        <Row label="Date" value={match.date} />
        <Row label="Time" value={match.time} />
        <Row label="Best of" value={`${match.bestOf} Frames`} />
      </CardContent>
    </Card>
  );
}
