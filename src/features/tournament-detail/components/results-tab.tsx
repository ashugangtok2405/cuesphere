import { Trophy } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { TournamentDetail } from "@/types/tournament-detail";

export function ResultsTab({ tournament }: { tournament: TournamentDetail }) {
  const completed = tournament.fixtures.filter((f) => f.status === "completed");

  if (completed.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="size-6" />}
        title="No results yet"
        description="Completed match results will appear here as the tournament progresses."
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Round</TableHead>
              <TableHead>Match</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completed.map((fixture, i) => (
              <TableRow key={i}>
                <TableCell className="text-muted-foreground">{fixture.round}</TableCell>
                <TableCell className="font-medium">
                  {fixture.players[0]} <span className="text-muted-foreground">vs</span> {fixture.players[1]}
                </TableCell>
                <TableCell className="text-right font-tabular font-bold text-primary">
                  {fixture.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
