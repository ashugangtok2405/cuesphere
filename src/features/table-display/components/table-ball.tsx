import { BALL_STYLES, type BallColor } from "@/features/live-match/components/ball-icon";
import { cn } from "@/lib/utils";

/** A plain snooker ball at an exact pixel size, for the 1920×1080 screens. */
export function TableBall({ color, size, className }: { color: BallColor; size: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.35),inset_3px_3px_6px_rgba(255,255,255,0.25)]",
        BALL_STYLES[color],
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}

export const COLOURS: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];
