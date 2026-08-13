import { TOURNAMENTS } from "@/lib/mock/tournaments";
import type { TournamentDetail } from "@/types/tournament-detail";

const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 45 * 60 * 1000 + 28 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const MONSOON_DETAIL: TournamentDetail = {
  ...TOURNAMENTS[0],
  status: "live",
  venueCity: "Lucknow",
  tables: 8,
  organizer: "XYZ Snooker Club",
  aboutText:
    "The Monsoon Championship is one of the most prestigious snooker tournaments of the year. Top players from across the country compete for the title and a massive prize pool.",
  endsAt: new Date(Date.now() + FOUR_DAYS_MS).toISOString(),
  progress: [
    { key: "r64", label: "R64", status: "completed" },
    { key: "r32", label: "R32", status: "completed" },
    { key: "r16", label: "R16", status: "completed" },
    { key: "qf", label: "QF", status: "current" },
    { key: "sf", label: "SF", status: "upcoming" },
    { key: "final", label: "Final", status: "upcoming" },
  ],
  currentStageLabel: "Quarter Finals",
  matchesCompleted: 16,
  totalMatches: 64,
  prizeBreakdown: [
    { rank: 1, label: "Winner", amount: "₹30,000" },
    { rank: 2, label: "Runner Up", amount: "₹15,000" },
    { rank: 3, label: "Semi Finalist (x2)", amount: "₹7,500" },
    { rank: 5, label: "Quarter Finalist (x4)", amount: "₹3,000" },
    { rank: 9, label: "Last 16 (x8)", amount: "₹1,000" },
  ],
  currentChampion: {
    name: "Vivek Singh",
    subtitle: "Monsoon Championship 2026",
  },
  nextMatch: {
    round: "Quarter Finals",
    table: "Table 2",
    isLive: true,
    players: [
      { name: "Rahul Sharma", country: "IN" },
      { name: "Aman Verma", country: "IN" },
    ],
  },
  pastChampions: [
    { year: "2027", name: "Vivek Singh" },
    { year: "2026", name: "Rahul Sharma" },
    { year: "2024", name: "Aman Verma" },
    { year: "2023", name: "Pankaj Advani" },
    { year: "2022", name: "Aditya Mehta" },
  ],
  sponsorNames: ["Aramith", "Strachan", "Rasson", "PERI", "LEONI", "West India Sports"],
  roster: Array.from({ length: 12 }, (_, i) => ({
    seed: i + 1,
    name: [
      "Rahul Sharma",
      "Aman Verma",
      "Vivek Singh",
      "Ashish Agarwal",
      "Rohit Jaiswal",
      "Manoj Kumar",
      "Sourabh Joshi",
      "Deepak Yadav",
      "Pawan Singh",
      "Karan Mehta",
      "Nikhil Rao",
      "Suresh Pillai",
    ][i],
    rating: 1920 - i * 28,
    status: "confirmed" as const,
  })),
  fixtures: [
    { round: "Quarter Finals", table: "Table 1", players: ["Vivek Singh", "Ashish Agarwal"], status: "upcoming" },
    { round: "Quarter Finals", table: "Table 2", players: ["Rahul Sharma", "Aman Verma"], status: "live" },
    { round: "Quarter Finals", table: "Table 3", players: ["Rohit Jaiswal", "Manoj Kumar"], status: "upcoming" },
    { round: "Quarter Finals", table: "Table 4", players: ["Sourabh Joshi", "Deepak Yadav"], status: "upcoming" },
    { round: "Round of 16", table: "Table 1", players: ["Vivek Singh", "Pawan Singh"], status: "completed", score: "4 – 1" },
    { round: "Round of 16", table: "Table 2", players: ["Ashish Agarwal", "Karan Mehta"], status: "completed", score: "4 – 2" },
    { round: "Round of 16", table: "Table 3", players: ["Rahul Sharma", "Nikhil Rao"], status: "completed", score: "4 – 0" },
    { round: "Round of 16", table: "Table 4", players: ["Aman Verma", "Suresh Pillai"], status: "completed", score: "4 – 3" },
  ],
  rules: [
    "Standard snooker rules apply as per WPBSA regulations.",
    "Matches are best of 7 frames until the semi-final stage, best of 9 for semi-finals and the final.",
    "Players must report to their table 10 minutes before the scheduled start time.",
    "A walkover will be awarded if a player fails to appear within 15 minutes of the scheduled start.",
    "The referee's decision on all matters of play is final.",
    "Dress code: collared shirt, dress trousers and formal shoes.",
  ],
  bestOfFrames: 7,
  dressCode: "Collared shirt, dress trousers and formal shoes",
  reportingTime: "10 minutes before scheduled match time",
  contactPerson: "Sanjay Kumar",
  contactNumber: "+91 98765 00000",
  registrationDeadline: new Date(Date.now() - 5 * DAY_MS).toISOString(),
  drawReleaseDate: new Date(Date.now() - 4 * DAY_MS).toISOString(),
  endDate: "2027-06-10",
};

function buildGenericDetail(base: (typeof TOURNAMENTS)[number]): TournamentDetail {
  return {
    ...base,
    venueCity: "Lucknow",
    tables: 6,
    organizer: "XYZ Snooker Club",
    aboutText: `${base.name} brings together ${base.players} players competing across a ${base.format.toLowerCase()} format for a prize pool of ${base.prizePool}.`,
    endsAt: new Date(Date.now() + FOUR_DAYS_MS).toISOString(),
    progress: [
      { key: "r64", label: "R64", status: base.status === "upcoming" ? "upcoming" : "completed" },
      { key: "r32", label: "R32", status: base.status === "upcoming" ? "upcoming" : "completed" },
      { key: "r16", label: "R16", status: base.status === "completed" ? "completed" : "upcoming" },
      { key: "qf", label: "QF", status: base.status === "live" ? "current" : "upcoming" },
      { key: "sf", label: "SF", status: "upcoming" },
      { key: "final", label: "Final", status: base.status === "completed" ? "completed" : "upcoming" },
    ],
    currentStageLabel: base.status === "completed" ? "Completed" : base.status === "live" ? "In Progress" : "Registration Open",
    matchesCompleted: base.status === "completed" ? base.players - 1 : base.status === "live" ? Math.floor(base.players / 4) : 0,
    totalMatches: base.players - 1,
    prizeBreakdown: [
      { rank: 1, label: "Winner", amount: base.prizePool },
      { rank: 2, label: "Runner Up", amount: "—" },
    ],
    currentChampion: { name: "Vivek Singh", subtitle: "Reigning Club Champion" },
    nextMatch: null,
    pastChampions: [
      { year: "2027", name: "Vivek Singh" },
      { year: "2026", name: "Rahul Sharma" },
    ],
    sponsorNames: ["Aramith", "Strachan", "Rasson", "PERI", "LEONI", "West India Sports"],
    roster: [],
    fixtures: [],
    rules: [
      "Standard snooker rules apply as per WPBSA regulations.",
      "The referee's decision on all matters of play is final.",
      "Dress code: collared shirt, dress trousers and formal shoes.",
    ],
    bestOfFrames: base.format === "Knockout" ? 7 : 5,
    dressCode: "Collared shirt, dress trousers and formal shoes",
    reportingTime: "10 minutes before scheduled match time",
    contactPerson: "Sanjay Kumar",
    contactNumber: "+91 98765 00000",
    registrationDeadline: new Date(
      Date.now() + (base.registrationOpen ? 1 : -1) * 3 * DAY_MS
    ).toISOString(),
    drawReleaseDate: new Date(
      Date.now() + (base.registrationOpen ? 1 : -1) * 4 * DAY_MS
    ).toISOString(),
    endDate: base.startDate,
  };
}

export function getTournamentDetail(slug: string): TournamentDetail | undefined {
  if (slug === MONSOON_DETAIL.slug) return MONSOON_DETAIL;
  const base = TOURNAMENTS.find((t) => t.slug === slug);
  if (!base) return undefined;
  return buildGenericDetail(base);
}
