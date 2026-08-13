import { BallIcon } from "@/features/live-match/components/ball-icon";
import type { BallColor } from "@/features/live-match/components/ball-icon";

const COLORS: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];

export function BallTracker({
  redsRemaining,
  availableColors,
  onPot,
}: {
  redsRemaining: number;
  availableColors: BallColor[];
  onPot?: (color: BallColor) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Balls Remaining On Table {onPot ? "— click a ball to pot it" : ""}
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <button
          type="button"
          disabled={!onPot || redsRemaining === 0}
          onClick={() => onPot?.("red")}
          className="flex flex-col items-center gap-1 disabled:cursor-not-allowed"
        >
          <div className="relative">
            <BallIcon color="red" className={redsRemaining === 0 ? "opacity-20" : ""} />
            <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-background text-[9px] font-bold text-foreground ring-1 ring-border">
              {redsRemaining}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Red</span>
        </button>
        {COLORS.map((color) => {
          const available = availableColors.includes(color);
          return (
            <button
              key={color}
              type="button"
              disabled={!onPot || !available}
              onClick={() => onPot?.(color)}
              className="disabled:cursor-not-allowed"
            >
              <BallIcon color={color} showLabel className={available ? "" : "opacity-20"} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
