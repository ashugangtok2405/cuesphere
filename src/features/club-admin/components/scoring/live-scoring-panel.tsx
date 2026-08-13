"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchHeader } from "@/features/club-admin/components/scoring/match-header";
import { PlayerScoreCard } from "@/features/club-admin/components/scoring/player-score-card";
import { BallTracker } from "@/features/club-admin/components/scoring/ball-tracker";
import { ScoreButtons } from "@/features/club-admin/components/scoring/score-buttons";
import { MatchActions } from "@/features/club-admin/components/scoring/match-actions";
import {
  FrameHistoryTable,
  type FrameEntry,
} from "@/features/club-admin/components/scoring/frame-history-table";
import { BALL_VALUES } from "@/features/live-match/components/ball-icon";
import type { BallColor } from "@/features/live-match/components/ball-icon";
import {
  finishMatchAction,
  saveMatchProgressAction,
  updateLiveProgressAction,
} from "@/app/actions/match-scoring-actions";
import type { DrawMatch } from "@/types/match";

const TOTAL_REDS = 15;
const COLORS: BallColor[] = ["yellow", "green", "brown", "blue", "pink", "black"];

interface LiveState {
  currentPlayer: 1 | 2;
  currentBreak: number;
  breakBalls: BallColor[];
  redsRemaining: number;
  /** Colors already potted for good — only tracked once all reds are gone. */
  coloredPotted: BallColor[];
  frameScoreP1: number;
  frameScoreP2: number;
  frameHistory: FrameEntry[];
  matchHighestBreak: number;
  matchHighestBreakPlayer: 1 | 2 | null;
}

interface Board {
  current: LiveState;
  history: LiveState[];
}

function initialState(): LiveState {
  return {
    currentPlayer: 1,
    currentBreak: 0,
    breakBalls: [],
    redsRemaining: TOTAL_REDS,
    coloredPotted: [],
    frameScoreP1: 0,
    frameScoreP2: 0,
    frameHistory: [],
    matchHighestBreak: 0,
    matchHighestBreakPlayer: null,
  };
}

/** Whoever was on strike for `prev.currentBreak` gets credited if it's now
 * the biggest break of the match — called right before a break resets. */
function carryHighestBreak(prev: LiveState): Pick<LiveState, "matchHighestBreak" | "matchHighestBreakPlayer"> {
  if (prev.currentBreak > prev.matchHighestBreak) {
    return { matchHighestBreak: prev.currentBreak, matchHighestBreakPlayer: prev.currentPlayer };
  }
  return { matchHighestBreak: prev.matchHighestBreak, matchHighestBreakPlayer: prev.matchHighestBreakPlayer };
}

export function LiveScoringPanel({
  match,
  player1PhotoUrl,
  player2PhotoUrl,
}: {
  match: DrawMatch;
  player1PhotoUrl?: string | null;
  player2PhotoUrl?: string | null;
}) {
  const router = useRouter();
  const [board, setBoard] = React.useState<Board>(() => ({ current: initialState(), history: [] }));
  const [isFinishing, setIsFinishing] = React.useState(false);
  const state = board.current;

  /** Always derives the next state from the freshest previous state, so
   * rapid repeated clicks (e.g. potting several reds in a row) never lose
   * an update to a stale closure. */
  function commit(updater: (prev: LiveState) => LiveState) {
    setBoard((b) => ({ current: updater(b.current), history: [...b.history, b.current] }));
  }

  function undo() {
    setBoard((b) => {
      if (b.history.length === 0) return b;
      return { current: b.history[b.history.length - 1], history: b.history.slice(0, -1) };
    });
  }

  function potBall(color: BallColor) {
    commit((prev) => {
      const isReds = color === "red";
      if (isReds && prev.redsRemaining <= 0) return prev;
      if (!isReds && prev.redsRemaining === 0 && prev.coloredPotted.includes(color)) return prev;

      const points = BALL_VALUES[color];
      const scoreKey = prev.currentPlayer === 1 ? "frameScoreP1" : "frameScoreP2";

      return {
        ...prev,
        redsRemaining: isReds ? prev.redsRemaining - 1 : prev.redsRemaining,
        coloredPotted:
          !isReds && prev.redsRemaining === 0 ? [...prev.coloredPotted, color] : prev.coloredPotted,
        currentBreak: prev.currentBreak + points,
        breakBalls: [...prev.breakBalls, color],
        [scoreKey]: prev[scoreKey] + points,
      };
    });
  }

  function foul(points: number) {
    commit((prev) => {
      const opponentKey = prev.currentPlayer === 1 ? "frameScoreP2" : "frameScoreP1";
      return {
        ...prev,
        ...carryHighestBreak(prev),
        currentBreak: 0,
        breakBalls: [],
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
        [opponentKey]: prev[opponentKey] + points,
      };
    });
  }

  function miss() {
    commit((prev) => ({
      ...prev,
      ...carryHighestBreak(prev),
      currentBreak: 0,
      breakBalls: [],
      currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
    }));
  }

  function freeBall() {
    toast.info("Free ball called.");
  }

  function endFrame() {
    if (state.frameScoreP1 === 0 && state.frameScoreP2 === 0) {
      toast.error("No points scored in this frame yet.");
      return;
    }

    const newFrameHistory = [
      ...state.frameHistory,
      { frame: state.frameHistory.length + 1, player1Score: state.frameScoreP1, player2Score: state.frameScoreP2 },
    ];
    const framesWonPlayer1 = newFrameHistory.filter((f) => f.player1Score > f.player2Score).length;
    const framesWonPlayer2 = newFrameHistory.filter((f) => f.player2Score > f.player1Score).length;
    saveMatchProgressAction(match.id, { framesWonPlayer1, framesWonPlayer2, frameScores: newFrameHistory }).catch(() => {});

    commit((prev) => ({
      ...initialState(),
      frameHistory: newFrameHistory,
      ...carryHighestBreak(prev),
    }));
  }

  async function finish() {
    let frames = state.frameHistory;
    const { matchHighestBreak, matchHighestBreakPlayer } = carryHighestBreak(state);
    if (state.frameScoreP1 !== 0 || state.frameScoreP2 !== 0) {
      frames = [
        ...frames,
        { frame: frames.length + 1, player1Score: state.frameScoreP1, player2Score: state.frameScoreP2 },
      ];
    }

    const framesWonPlayer1 = frames.filter((f) => f.player1Score > f.player2Score).length;
    const framesWonPlayer2 = frames.filter((f) => f.player2Score > f.player1Score).length;

    if (framesWonPlayer1 === framesWonPlayer2) {
      toast.error("Frames are tied — play or end at least one more frame first.");
      return;
    }

    const highestBreakPlayerId =
      matchHighestBreakPlayer === 1
        ? match.player1Id
        : matchHighestBreakPlayer === 2
          ? match.player2Id
          : undefined;

    setIsFinishing(true);
    const result = await finishMatchAction(match.id, {
      framesWonPlayer1,
      framesWonPlayer2,
      highestBreak: matchHighestBreak,
      highestBreakPlayerId,
      frameScores: frames,
    });
    setIsFinishing(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Match finished — player stats updated.");
    router.refresh();
  }

  // Push the in-progress frame score + current break to the DB after every
  // change, so the public live page reflects it (it polls periodically).
  React.useEffect(() => {
    const { matchHighestBreak, matchHighestBreakPlayer } = carryHighestBreak(state);
    const highestBreakSoFarPlayerId =
      matchHighestBreakPlayer === 1 ? match.player1Id : matchHighestBreakPlayer === 2 ? match.player2Id : null;

    updateLiveProgressAction(match.id, {
      currentFrameScorePlayer1: state.frameScoreP1,
      currentFrameScorePlayer2: state.frameScoreP2,
      currentBreak: state.currentBreak,
      currentBreakBalls: state.breakBalls,
      redsRemaining: state.redsRemaining,
      highestBreakSoFar: matchHighestBreak,
      highestBreakSoFarPlayerId,
    }).catch(() => {});
  }, [
    match.id,
    match.player1Id,
    match.player2Id,
    state.frameScoreP1,
    state.frameScoreP2,
    state.currentBreak,
    state.breakBalls,
    state.redsRemaining,
    state.matchHighestBreak,
    state.matchHighestBreakPlayer,
    state.currentPlayer,
  ]);

  const currentPlayerName = state.currentPlayer === 1 ? match.player1Name : match.player2Name;
  const availableColors =
    state.redsRemaining > 0 ? COLORS : COLORS.filter((c) => !state.coloredPotted.includes(c));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">Live Score</CardTitle>
        <p className="text-xs text-muted-foreground">Update every ball in real time — no page refresh.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <MatchHeader match={match} />

        <div className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4">
          <PlayerScoreCard
            name={match.player1Name}
            photoUrl={player1PhotoUrl}
            score={state.frameScoreP1}
            highlight={state.currentPlayer === 1}
          />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Current Break</p>
            <p className="font-tabular text-2xl font-bold text-primary">{state.currentBreak}</p>
            <p className="text-[11px] text-muted-foreground">{currentPlayerName}&apos;s break</p>
          </div>
          <PlayerScoreCard
            name={match.player2Name}
            photoUrl={player2PhotoUrl}
            score={state.frameScoreP2}
            align="right"
            highlight={state.currentPlayer === 2}
          />
        </div>

        <BallTracker redsRemaining={state.redsRemaining} availableColors={availableColors} onPot={potBall} />

        <ScoreButtons
          redsRemaining={state.redsRemaining}
          availableColors={availableColors}
          onPot={potBall}
          onFoul={foul}
          onMiss={miss}
          onFreeBall={freeBall}
        />

        <MatchActions
          onUndo={undo}
          onEndFrame={endFrame}
          onFinish={finish}
          canUndo={board.history.length > 0}
          isFinishing={isFinishing}
        />

        {state.frameHistory.length > 0 ? (
          <FrameHistoryTable
            frames={state.frameHistory}
            player1Name={match.player1Name}
            player2Name={match.player2Name}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
