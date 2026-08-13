import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveClock } from "@/features/live-match/components/live-clock";
import { BallIcon, BALL_VALUES } from "@/features/live-match/components/ball-icon";
import type { LiveMatchView } from "@/features/live-match/types";
import { cn } from "@/lib/utils";

export function CurrentFrameCard({
  match,
  frameStartMs,
}: {
  match: LiveMatchView;
  frameStartMs: number;
}) {
  const isPlayer1 = match.currentBreak.owner === "player1";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">
          Frame {match.currentFrameNumber} In Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AvatarInitials name={match.player1.name} photoUrl={match.player1.photoUrl} size="sm" />
            <span className="text-sm font-medium text-foreground">{match.player1.name}</span>
            <span
              className={cn("size-2 rounded-full", isPlayer1 ? "bg-success" : "bg-border")}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-tabular text-2xl font-bold text-primary">
              {match.currentBreak.points}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Current Break
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn("size-2 rounded-full", !isPlayer1 ? "bg-destructive" : "bg-border")}
            />
            <span className="text-sm font-medium text-foreground">{match.player2.name}</span>
            <AvatarInitials name={match.player2.name} photoUrl={match.player2.photoUrl} size="sm" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <LiveClock mode="up" referenceMs={frameStartMs} className="font-semibold text-foreground" />
          <span>Elapsed Time</span>
        </div>

        <div>
          <p className="mb-2 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
            Ball on Table
          </p>
          <div className="flex items-center justify-center gap-2">
            {match.ballsOnTable.map((color) => (
              <div key={color} className="relative">
                <BallIcon color={color} showLabel className={color === "red" && match.redsRemaining === 0 ? "opacity-20" : ""} />
                {color === "red" ? (
                  <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-background text-[9px] font-bold text-foreground ring-1 ring-border">
                    {match.redsRemaining}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Break Building</p>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-tabular text-base font-bold text-success">
                {match.currentBreak.points}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {Array.from({ length: 7 }, (_, i) => match.currentBreak.balls[i]).map((color, i) => (
              <span
                key={i}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-bold",
                  color ? "text-white" : "border border-dashed border-border text-muted-foreground"
                )}
                style={
                  color
                    ? {
                        background: {
                          red: "#E53935",
                          yellow: "#F5C518",
                          green: "#2E7D32",
                          brown: "#6D4C33",
                          blue: "#1E88E5",
                          pink: "#EC6FA6",
                          black: "#161616",
                        }[color],
                      }
                    : undefined
                }
              >
                {color ? BALL_VALUES[color] : "–"}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
