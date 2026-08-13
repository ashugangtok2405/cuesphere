import type { BallColor } from "@/features/live-match/components/ball-icon";

export type MatchStatus = "awaiting_draw" | "scheduled" | "live" | "completed";

export interface FrameScore {
  frame: number;
  player1Score: number;
  player2Score: number;
}

export interface DrawMatch {
  id: string;
  clubId: string;
  tournamentId: string;
  round: string;
  tableNumber: number;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  reportingTime: string;
  matchStartTime: string;
  status: MatchStatus;
  winnerId: string | null;
  score: string | null;
  framesWonPlayer1: number;
  framesWonPlayer2: number;
  highestBreak: number;
  highestBreakPlayerId: string | null;
  currentFrameScorePlayer1: number;
  currentFrameScorePlayer2: number;
  currentBreak: number;
  currentBreakBalls: BallColor[];
  redsRemaining: number;
  frameScores: FrameScore[];
}
