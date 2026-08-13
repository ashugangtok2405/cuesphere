"use client";

import { useState } from "react";
import { Expand } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiveBadge } from "@/components/shared/live-badge";
import { LiveClock } from "@/features/live-match/components/live-clock";
import type { LiveMatchView } from "@/features/live-match/types";
import { cn } from "@/lib/utils";

const BALL_HEX: Record<string, string> = {
  red: "#E53935",
  yellow: "#F5C518",
  green: "#2E7D32",
  brown: "#6D4C33",
  blue: "#1E88E5",
  pink: "#EC6FA6",
  black: "#161616",
};

const OBJECT_BALL_POSITIONS = [
  { top: "38%", left: "40%" },
  { top: "48%", left: "45%" },
  { top: "58%", left: "42%" },
  { top: "42%", left: "52%" },
  { top: "62%", left: "56%" },
  { top: "34%", left: "62%" },
];

export function TableViewCard({
  match,
  nextFrameCountdownStartMs,
}: {
  match: LiveMatchView;
  nextFrameCountdownStartMs: number;
}) {
  const [camera, setCamera] = useState<1 | 2>(1);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {match.isLive ? <LiveBadge /> : null}
            <p className="font-heading text-sm font-bold text-foreground">{match.tableLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={camera === 1 ? "outline" : "ghost"}
              className={cn(camera === 1 && "border-primary/50 text-primary")}
              onClick={() => setCamera(1)}
            >
              Camera 1
            </Button>
            <Button
              size="sm"
              variant={camera === 2 ? "outline" : "ghost"}
              className={cn(camera === 2 && "border-primary/50 text-primary")}
              onClick={() => setCamera(2)}
            >
              Camera 2
            </Button>
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-[6px] border-[#3a2415] felt-texture">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30" />
          {["top-1.5 left-1.5", "top-1.5 right-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"].map(
            (pos) => (
              <span key={pos} className={cn("absolute size-4 rounded-full bg-black/70", pos)} />
            )
          )}
          <span className="absolute left-1/2 top-1.5 size-4 -translate-x-1/2 rounded-full bg-black/70" />
          <span className="absolute bottom-1.5 left-1/2 size-4 -translate-x-1/2 rounded-full bg-black/70" />

          {match.ballsOnTable.map((color, i) => {
            const pos = OBJECT_BALL_POSITIONS[i % OBJECT_BALL_POSITIONS.length];
            return (
              <span
                key={i}
                className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.3)] sm:size-4"
                style={{ top: pos.top, left: pos.left, background: BALL_HEX[color] }}
              />
            );
          })}
          <span
            className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2)] sm:size-4"
            style={{ top: "70%", left: "72%" }}
          />

          <span className="absolute left-3 top-3 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            Camera {camera}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Next Frame</p>
            <LiveClock
              mode="down"
              referenceMs={nextFrameCountdownStartMs}
              className="text-sm font-bold text-primary"
            />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Match Status</p>
            <p className="text-sm font-bold text-success">{match.matchStatus}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Remaining Frames</p>
            <p className="text-sm font-bold text-foreground">{match.remainingFrames}</p>
          </div>
          <Button size="icon-sm" variant="ghost" aria-label="Expand">
            <Expand className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
