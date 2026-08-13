"use client";

import * as React from "react";
import { CheckCircle2, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  ScoringModeSelector,
  type ScoringMode,
} from "@/features/club-admin/components/scoring/scoring-mode-selector";
import { ResultOnlyPanel } from "@/features/club-admin/components/scoring/result-only-panel";
import { FrameByFramePanel } from "@/features/club-admin/components/scoring/frame-by-frame-panel";
import { LiveScoringPanel } from "@/features/club-admin/components/scoring/live-scoring-panel";
import type { DrawMatch } from "@/types/match";

export function MatchScoringView({
  match,
  player1PhotoUrl,
  player2PhotoUrl,
}: {
  match: DrawMatch;
  player1PhotoUrl?: string | null;
  player2PhotoUrl?: string | null;
}) {
  const [mode, setMode] = React.useState<ScoringMode>("result");

  if (match.status === "completed") {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-foreground">Match Completed</p>
            <p className="text-sm text-muted-foreground">
              {match.player1Name} {match.score ?? `${match.framesWonPlayer1} – ${match.framesWonPlayer2}`}{" "}
              {match.player2Name}
            </p>
            {match.highestBreak > 0 ? (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="size-3.5 text-primary" /> Highest break: {match.highestBreak}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <ScoringModeSelector mode={mode} onChange={setMode} />
      {mode === "result" && (
        <ResultOnlyPanel match={match} player1PhotoUrl={player1PhotoUrl} player2PhotoUrl={player2PhotoUrl} />
      )}
      {mode === "frames" && (
        <FrameByFramePanel match={match} player1PhotoUrl={player1PhotoUrl} player2PhotoUrl={player2PhotoUrl} />
      )}
      {mode === "live" && (
        <LiveScoringPanel match={match} player1PhotoUrl={player1PhotoUrl} player2PhotoUrl={player2PhotoUrl} />
      )}
    </div>
  );
}
