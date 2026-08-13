export interface PlayerStatistics {
  playerId: string;
  clubId: string;
  tournamentsPlayed: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  framesWon: number;
  framesLost: number;
  highestBreak: number;
  rankingPoints: number;
  prizeMoney: number;
  recentForm: ("W" | "L")[];
}

export interface Achievement {
  id: string;
  playerId: string;
  clubId: string;
  title: string;
  description: string;
  dateAwarded: string;
  icon: "trophy" | "medal" | "flame" | "star";
}

export interface TournamentResult {
  id: string;
  clubId: string;
  tournamentId: string;
  playerId: string;
  position: number;
  prizeMoney: number;
}
