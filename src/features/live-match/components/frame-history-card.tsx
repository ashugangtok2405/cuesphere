import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LiveMatchView } from "@/features/live-match/types";
import { cn } from "@/lib/utils";

export function FrameHistoryCard({ match }: { match: LiveMatchView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Frame History</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Frame</TableHead>
              <TableHead>{match.player1.name}</TableHead>
              <TableHead>{match.player2.name}</TableHead>
              <TableHead className="pr-6 text-right">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {match.frameHistory.map((frame) => (
              <TableRow key={frame.frame}>
                <TableCell className="pl-6 font-tabular text-muted-foreground">{frame.frame}</TableCell>
                <TableCell className="font-tabular">{frame.player1 ?? "–"}</TableCell>
                <TableCell className="font-tabular">{frame.player2 ?? "–"}</TableCell>
                <TableCell className="pr-6 text-right">
                  {frame.winner ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold",
                        frame.winner === "player1" ? "text-success" : "text-destructive"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          frame.winner === "player1" ? "bg-success" : "bg-destructive"
                        )}
                      />
                      {frame.winner === "player1" ? match.player1.name : match.player2.name}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">–</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
