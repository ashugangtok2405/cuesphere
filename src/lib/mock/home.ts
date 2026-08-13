export const CLUB_STATS = [
  { key: "tournaments", label: "Tournaments", value: 48 },
  { key: "players", label: "Players", value: 624 },
  { key: "matches", label: "Matches", value: 3826 },
  { key: "highestBreak", label: "Highest Break", value: 119 },
  { key: "prizeMoney", label: "Prize Money", value: 1200000, prefix: "₹" },
  { key: "ongoing", label: "Ongoing Tournaments", value: 5 },
] as const;

export const LIVE_MATCH = {
  tournament: "Monsoon Championship 2027",
  round: "Quarter Finals",
  table: "Table 2",
  players: [
    { name: "Rahul Sharma", country: "IN", score: 2 },
    { name: "Aman Verma", country: "IN", score: 1 },
  ],
  href: "/live/table-2",
};

export const UPCOMING_TOURNAMENT = {
  name: "Summer Open 2027",
  dateRange: "15 Jul – 20 Jul 2027",
  location: "XYZ Snooker Arena",
  prizePool: "₹1,00,000",
  href: "/tournaments/summer-open-2027",
};

export const CURRENT_CHAMPION = {
  name: "Vivek Singh",
  tournament: "Monsoon Championship 2027",
  href: "/tournaments/monsoon-championship-2027",
};

export const HIGHEST_BREAK = {
  value: 119,
  by: "Rahul Sharma",
  tournament: "National Open 2026",
  href: "/hall-of-fame#highest-break",
};

export const LATEST_NEWS = [
  { title: "Monsoon Championship 2027 – Draw Released", date: "10 Jun 2027" },
  { title: "Summer Open 2027 – Registration Open", date: "08 Jun 2027" },
  { title: "Club Night – This Friday", date: "05 Jun 2027" },
  { title: "Independence Cup 2027 – Winners Announced", date: "02 Jun 2027" },
] as const;

export const GALLERY_HIGHLIGHTS = [
  { caption: "Monsoon Championship 2027" },
  { caption: "Summer Open 2027" },
  { caption: "Independence Cup 2027" },
  { caption: "Club Night" },
] as const;
