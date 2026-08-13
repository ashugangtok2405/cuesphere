export type ClubTournamentStatus = "upcoming" | "live" | "completed";

export interface PrizeBreakdownItem {
  label: string;
  amount: string;
}

export interface ClubTournament {
  id: string;
  clubId: string;
  slug: string;
  name: string;
  description: string;
  status: ClubTournamentStatus;
  startDate: string | null;
  endDate: string | null;
  location: string;
  prizePool: string;
  entryFee: string;
  format: string;
  bestOf: number;
  maxPlayers: number;
  registrationOpen: boolean;
  imageUrl: string;
  prizeBreakdown: PrizeBreakdownItem[];
  championId: string | null;
  runnerUpId: string | null;
  createdAt: string;
}
