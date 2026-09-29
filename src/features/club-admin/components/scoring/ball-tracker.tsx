import { BallIcon } from "@/features/live-match/components/ball-icon";
import type { BallColor } from "@/features/live-match/components/ball-icon";

const COLORS: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];

/** What's left on the table: reds count plus which colours are still on. */
export function BallTracker({
  redsRemaining,
  colorsOnTable,
  pointsRemaining,
}: {
  redsRemaining: number;
  colorsOnTable: BallColor[];
  pointsRemaining: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="mb-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>On the table</span>
        <span className="normal-case tracking-normal">{pointsRemaining} pts left</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <BallIcon color="red" size="sm" className={redsRemaining === 0 ? "opacity-20" : ""} />×{" "}
          {redsRemaining}
        </span>
        <span className="h-5 w-px bg-border-strong" />
        {COLORS.map((color) => (
          <BallIcon key={color} color={color} size="sm" className={colorsOnTable.includes(color) ? "" : "opacity-15"} />
        ))}
      </div>
    </div>
  );
}
