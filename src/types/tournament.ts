export type TournamentStatus = "upcoming" | "live" | "completed";
export type TournamentFormat = "Knockout" | "Round Robin" | "League + Playoffs";
export type TournamentAccent = "gold" | "red" | "blue" | "purple" | "green" | "table";

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  status: TournamentStatus;
  featured?: boolean;
  dateRange: string;
  startDate: string;
  /** Maximum player capacity for the tournament. */
  players: number;
  /** How many players have currently registered, out of `players`. */
  registeredCount: number;
  /** Whether new registrations are currently being accepted. */
  registrationOpen: boolean;
  location: string;
  prizePool: string;
  entryFee: string;
  format: TournamentFormat;
  accent: TournamentAccent;
}
