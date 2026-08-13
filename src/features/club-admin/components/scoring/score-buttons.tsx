import { BALL_VALUES } from "@/features/live-match/components/ball-icon";
import type { BallColor } from "@/features/live-match/components/ball-icon";
import { Button } from "@/components/ui/button";

const COLOR_ORDER: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];
const FOUL_VALUES = [4, 5, 6, 7];

export function ScoreButtons({
  redsRemaining,
  availableColors,
  onPot,
  onFoul,
  onMiss,
  onFreeBall,
}: {
  redsRemaining: number;
  availableColors: BallColor[];
  onPot: (color: BallColor) => void;
  onFoul: (points: number) => void;
  onMiss: () => void;
  onFreeBall: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pot Ball</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          <Button
            variant="outline"
            size="sm"
            className="h-12 flex-col gap-0.5"
            disabled={redsRemaining === 0}
            onClick={() => onPot("red")}
          >
            <span className="font-tabular text-sm">+{BALL_VALUES.red}</span>
            <span className="text-[10px] text-muted-foreground">Red ({redsRemaining})</span>
          </Button>
          {COLOR_ORDER.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              className="h-12 flex-col gap-0.5"
              disabled={!availableColors.includes(color)}
              onClick={() => onPot(color)}
            >
              <span className="font-tabular text-sm">+{BALL_VALUES[color]}</span>
              <span className="text-[10px] capitalize text-muted-foreground">{color}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Foul</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {FOUL_VALUES.map((points) => (
            <Button key={points} variant="destructive" size="sm" onClick={() => onFoul(points)}>
              +{points}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={onMiss}>
            Miss
          </Button>
          <Button variant="outline" size="sm" onClick={onFreeBall}>
            Free Ball
          </Button>
        </div>
      </div>
    </div>
  );
}
