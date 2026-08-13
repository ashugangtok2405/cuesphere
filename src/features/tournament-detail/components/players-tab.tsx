import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";
import type { TournamentDetail } from "@/types/tournament-detail";

export function PlayersTab({ tournament }: { tournament: TournamentDetail }) {
  if (tournament.roster.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="Player list not published yet"
        description="Registered players will appear here once the entry list is finalized."
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Seed</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournament.roster.map((player) => (
              <TableRow key={player.seed}>
                <TableCell className="font-tabular text-muted-foreground">{player.seed}</TableCell>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="font-tabular text-primary">{player.rating}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={player.status === "confirmed" ? "default" : "secondary"}>
                    {player.status === "confirmed" ? "Confirmed" : "Waitlist"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
