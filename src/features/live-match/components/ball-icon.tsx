import { cn } from "@/lib/utils";

export type BallColor = "red" | "yellow" | "green" | "brown" | "blue" | "pink" | "black";

export const BALL_VALUES: Record<BallColor, number> = {
  red: 1,
  yellow: 2,
  green: 3,
  brown: 4,
  blue: 5,
  pink: 6,
  black: 7,
};

const BALL_STYLES: Record<BallColor, string> = {
  red: "bg-[#E53935] text-white",
  yellow: "bg-[#F5C518] text-black",
  green: "bg-[#2E7D32] text-white",
  brown: "bg-[#6D4C33] text-white",
  blue: "bg-[#1E88E5] text-white",
  pink: "bg-[#EC6FA6] text-white",
  black: "bg-[#161616] text-white",
};

export function BallIcon({
  color,
  size = "md",
  showLabel = false,
  className,
}: {
  color: BallColor;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const sizeClass = size === "sm" ? "size-5 text-[10px]" : size === "lg" ? "size-9 text-sm" : "size-7 text-xs";

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-bold shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.35),inset_2px_2px_3px_rgba(255,255,255,0.25)]",
          BALL_STYLES[color],
          sizeClass,
          className
        )}
      >
        {BALL_VALUES[color]}
      </span>
      {showLabel ? (
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{color}</span>
      ) : null}
    </div>
  );
}
