import { BallIcon, BALL_VALUES } from "@/features/live-match/components/ball-icon";
import type { BallColor } from "@/features/live-match/components/ball-icon";
import { cn } from "@/lib/utils";

const COLOR_ORDER: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];
const FOUL_VALUES = [4, 5, 6, 7];

export function ScoreButtons({
  redsRemaining,
  canPotRed,
  availableColors,
  canFreeBall,
  hint,
  onPot,
  onFoul,
  onMiss,
  onFreeBall,
}: {
  redsRemaining: number;
  canPotRed: boolean;
  availableColors: BallColor[];
  canFreeBall: boolean;
  hint: string;
  onPot: (color: BallColor) => void;
  onFoul: (points: number) => void;
  onMiss: () => void;
  onFreeBall: () => void;
}) {
  const potButtons: { color: BallColor; enabled: boolean; label: string }[] = [
    { color: "red", enabled: canPotRed, label: `Red (${redsRemaining})` },
    ...COLOR_ORDER.map((color) => ({
      color,
      enabled: availableColors.includes(color),
      label: color[0].toUpperCase() + color.slice(1),
    })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Pot Ball</span>
          <span className="normal-case tracking-normal">{hint}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {potButtons.map(({ color, enabled, label }) => (
            <button
              key={color}
              type="button"
              disabled={!enabled}
              onClick={() => onPot(color)}
              aria-label={`Pot ${color}, ${BALL_VALUES[color]} ${BALL_VALUES[color] === 1 ? "point" : "points"}`}
              className="flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <BallIcon color={color} size="lg" />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onMiss}
            className="flex h-[72px] items-center justify-center rounded-2xl border border-dashed border-border-strong text-sm font-semibold text-muted-foreground transition active:scale-95"
          >
            Miss
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Foul · points to opponent
        </p>
        <div className="grid grid-cols-5 gap-2">
          {FOUL_VALUES.map((points) => (
            <button
              key={points}
              type="button"
              onClick={() => onFoul(points)}
              aria-label={`Foul, ${points} points to opponent`}
              className="h-12 rounded-xl border border-destructive/40 bg-destructive-soft font-tabular text-base font-bold text-destructive transition active:scale-95"
            >
              +{points}
            </button>
          ))}
          <button
            type="button"
            disabled={!canFreeBall}
            onClick={onFreeBall}
            className={cn(
              "h-12 rounded-xl border border-border-strong text-xs font-semibold text-foreground transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            )}
          >
            Free ball
          </button>
        </div>
      </div>
    </div>
  );
}
