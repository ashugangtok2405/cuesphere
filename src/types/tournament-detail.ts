import type { Tournament } from "@/types/tournament";

export interface ProgressStage {
  key: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

export interface PrizeBreakdownItem {
  rank: number;
  label: string;
  amount: string;
}

export interface ChampionSummary {
  name: string;
  subtitle: string;
}

export interface NextMatchPlayer {
  name: string;
  country: string;
}

export interface NextMatch {
  round: string;
  table: string;
  isLive: boolean;
  players: [NextMatchPlayer, NextMatchPlayer];
}

export interface PastChampion {
  year: string;
  name: string;
}

export interface RegisteredPlayer {
  seed: number;
  name: string;
  rating: number;
  status: "confirmed" | "waitlist";
}

export interface Fixture {
  round: string;
  table: string;
  players: [string, string];
  status: "completed" | "live" | "upcoming";
  score?: string;
}

export interface TournamentDetail extends Tournament {
  venueCity: string;
  tables: number;
  organizer: string;
  aboutText: string;
  endsAt: string;
  progress: ProgressStage[];
  currentStageLabel: string;
  matchesCompleted: number;
  totalMatches: number;
  prizeBreakdown: PrizeBreakdownItem[];
  currentChampion: ChampionSummary;
  nextMatch: NextMatch | null;
  pastChampions: PastChampion[];
  sponsorNames: string[];
  roster: RegisteredPlayer[];
  fixtures: Fixture[];
  rules: string[];
  bestOfFrames: number;
  dressCode: string;
  reportingTime: string;
  contactPerson: string;
  contactNumber: string;
  registrationDeadline: string;
  drawReleaseDate: string;
  endDate: string;
}
