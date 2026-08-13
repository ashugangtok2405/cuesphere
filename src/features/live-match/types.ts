import type { BallColor } from "@/features/live-match/components/ball-icon";

export interface LiveMatchPlayer {
  name: string;
  country: string;
  framesWon: number;
  points: number;
  photoUrl?: string;
}

export interface FrameResult {
  frame: number;
  player1: number | null;
  player2: number | null;
  winner: "player1" | "player2" | null;
}

export interface CommentaryItem {
  time: string;
  text: string;
}

export interface LiveMatchView {
  tournamentName: string;
  round: string;
  tableLabel: string;
  isLive: boolean;
  bestOf: number;
  referee: string;
  startedAt: string;
  date: string;
  time: string;
  player1: LiveMatchPlayer;
  player2: LiveMatchPlayer;
  currentFrameNumber: number;
  currentBreak: { points: number; owner: "player1" | "player2"; balls: BallColor[] };
  frameHistory: FrameResult[];
  ballsOnTable: BallColor[];
  redsRemaining: number;
  matchStatus: string;
  nextFrameCountdownSeconds: number | null;
  remainingFrames: number;
  commentary: CommentaryItem[];
  headToHead: { player1Wins: number; player2Wins: number };
  seasonStats: {
    player1: { matches: number; wins: number; winRate: number; highestBreak: number };
    player2: { matches: number; wins: number; winRate: number; highestBreak: number };
  };
  highestBreakInMatch: { points: number; by: "player1" | "player2"; frame: number };
  nextMatch: { date: string; time: string } | null;
}
