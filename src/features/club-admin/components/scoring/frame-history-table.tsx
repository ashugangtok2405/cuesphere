import { CheckCircle2 } from "lucide-react";

export interface FrameEntry {
  frame: number;
  player1Score: number;
  player2Score: number;
}

export function FrameHistoryTable({
  frames,
  player1Name,
  player2Name,
}: {
  frames: FrameEntry[];
  player1Name: string;
  player2Name: string;
}) {
  if (frames.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No frames recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2">Frame</th>
            <th className="px-3 py-2">{player1Name}</th>
            <th className="px-3 py-2">{player2Name}</th>
            <th className="px-3 py-2">Winner</th>
          </tr>
        </thead>
        <tbody>
          {frames.map((frame) => {
            const winner =
              frame.player1Score === frame.player2Score
                ? null
                : frame.player1Score > frame.player2Score
                  ? player1Name
                  : player2Name;
            return (
              <tr key={frame.frame} className="border-b border-border/50 last:border-b-0">
                <td className="px-3 py-2 font-tabular text-muted-foreground">{frame.frame}</td>
                <td className="px-3 py-2 font-tabular text-foreground">{frame.player1Score}</td>
                <td className="px-3 py-2 font-tabular text-foreground">{frame.player2Score}</td>
                <td className="px-3 py-2">
                  {winner ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                      <CheckCircle2 className="size-3.5" /> {winner}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
