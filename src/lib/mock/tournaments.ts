import type { Tournament } from "@/types/tournament";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Demo-only: derives a stable "closes in N days" countdown target for a tournament. */
export function getMockRegistrationDeadline(tournament: Tournament): string {
  const idNumber = Number(tournament.id.replace(/[^0-9]/g, "")) || 1;
  const offsetDays = 1 + (idNumber % 6);
  return new Date(Date.now() + offsetDays * DAY_MS).toISOString();
}

function makeUpcoming(
  id: number,
  name: string,
  dateRange: string,
  startDate: string,
  maxPlayers: number,
  prizePool: string,
  entryFee: string,
  format: Tournament["format"],
  accent: Tournament["accent"],
  options: { featured?: boolean; registrationOpen?: boolean; registeredCount?: number } = {}
): Tournament {
  const { featured = false, registrationOpen = false, registeredCount = maxPlayers } = options;
  return {
    id: `t-${id}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    status: "upcoming",
    featured,
    dateRange,
    startDate,
    players: maxPlayers,
    registeredCount,
    registrationOpen,
    location: "XYZ Snooker Arena",
    prizePool,
    entryFee,
    format,
    accent,
  };
}

export const TOURNAMENTS: Tournament[] = [
  makeUpcoming(1, "Monsoon Championship 2027", "01 Jun – 10 Jun 2027", "2027-06-01", 64, "₹75,000", "₹1,000", "Knockout", "green", {
    featured: true,
    registrationOpen: true,
    registeredCount: 41,
  }),
  makeUpcoming(2, "Summer Open 2027", "15 Jun – 20 Jun 2027", "2027-06-15", 128, "₹1,50,000", "₹1,500", "Round Robin", "red", {
    registrationOpen: true,
    registeredCount: 128,
  }),
  makeUpcoming(3, "Independence Cup 2027", "13 Aug – 15 Jun 2027", "2027-08-13", 64, "₹80,000", "₹800", "Knockout", "blue", {
    registrationOpen: true,
    registeredCount: 52,
  }),
  makeUpcoming(4, "Diwali Open 2027", "20 Oct – 07 Nov 2027", "2027-10-20", 64, "₹2,00,000", "₹2,000", "League + Playoffs", "purple", {
    registrationOpen: true,
    registeredCount: 19,
  }),
  makeUpcoming(5, "Winter Classic 2027", "15 Dec – 20 Dec 2027", "2027-12-15", 64, "₹1,00,000", "₹1,000", "Knockout", "gold"),
  makeUpcoming(6, "New Year Knockout 2028", "01 Jan – 05 Jan 2028", "2028-01-01", 32, "₹50,000", "₹500", "Knockout", "table"),
  makeUpcoming(7, "Republic Day Open 2028", "22 Jan – 26 Jan 2028", "2028-01-22", 48, "₹90,000", "₹900", "Round Robin", "gold", {
    registrationOpen: true,
    registeredCount: 30,
  }),
  makeUpcoming(8, "Valentine Doubles Cup 2028", "12 Feb – 14 Feb 2028", "2028-02-12", 32, "₹60,000", "₹1,200", "League + Playoffs", "red", {
    registrationOpen: true,
    registeredCount: 28,
  }),
  makeUpcoming(9, "Spring Invitational 2028", "05 Mar – 10 Mar 2028", "2028-03-05", 64, "₹1,20,000", "₹1,100", "Knockout", "green", {
    registrationOpen: true,
    registeredCount: 45,
  }),
  makeUpcoming(10, "Holi Break Challenge 2028", "20 Mar – 22 Mar 2028", "2028-03-20", 32, "₹40,000", "₹600", "Knockout", "purple", {
    registrationOpen: true,
    registeredCount: 12,
  }),
  makeUpcoming(11, "Founders Cup 2028", "10 Apr – 15 Apr 2028", "2028-04-10", 64, "₹1,10,000", "₹1,000", "Round Robin", "blue"),
  makeUpcoming(12, "Summer Junior Open 2028", "01 May – 04 May 2028", "2028-05-01", 32, "₹30,000", "₹400", "Knockout", "table"),
  makeUpcoming(13, "Monsoon Championship 2028", "01 Jun – 10 Jun 2028", "2028-06-01", 64, "₹80,000", "₹1,000", "Knockout", "green"),
  makeUpcoming(14, "Summer Open 2028", "15 Jun – 20 Jun 2028", "2028-06-15", 128, "₹1,60,000", "₹1,500", "Round Robin", "red"),
  makeUpcoming(15, "Ladies Invitational 2028", "05 Jul – 08 Jul 2028", "2028-07-05", 32, "₹70,000", "₹800", "League + Playoffs", "purple"),
  makeUpcoming(16, "Veterans Cup 2028", "20 Jul – 22 Jul 2028", "2028-07-20", 24, "₹50,000", "₹700", "Knockout", "gold"),
  makeUpcoming(17, "Independence Cup 2028", "13 Aug – 15 Aug 2028", "2028-08-13", 64, "₹85,000", "₹800", "Knockout", "blue"),
  makeUpcoming(18, "Club Championship 2028", "01 Sep – 12 Sep 2028", "2028-09-01", 96, "₹2,50,000", "₹2,000", "League + Playoffs", "gold"),
  makeUpcoming(19, "Autumn Classic 2028", "18 Sep – 20 Sep 2028", "2028-09-18", 48, "₹65,000", "₹900", "Round Robin", "table"),
  makeUpcoming(20, "Diwali Open 2028", "20 Oct – 07 Nov 2028", "2028-10-20", 64, "₹2,10,000", "₹2,000", "League + Playoffs", "purple"),
  makeUpcoming(21, "Junior Masters 2028", "12 Nov – 14 Nov 2028", "2028-11-12", 32, "₹35,000", "₹400", "Knockout", "green"),
  makeUpcoming(22, "City Open 2028", "25 Nov – 29 Nov 2028", "2028-11-25", 64, "₹95,000", "₹1,000", "Knockout", "red"),
  makeUpcoming(23, "Winter Classic 2028", "15 Dec – 20 Dec 2028", "2028-12-15", 64, "₹1,05,000", "₹1,000", "Knockout", "gold"),
  makeUpcoming(24, "New Year Knockout 2029", "01 Jan – 05 Jan 2029", "2029-01-01", 32, "₹55,000", "₹500", "Knockout", "table"),

  {
    id: "t-25",
    slug: "monsoon-championship-2027-live",
    name: "Monsoon Championship 2027",
    status: "live",
    dateRange: "01 Jun – 10 Jun 2027",
    startDate: "2027-06-01",
    players: 64,
    registeredCount: 64,
    registrationOpen: false,
    location: "XYZ Snooker Arena",
    prizePool: "₹75,000",
    entryFee: "₹1,000",
    format: "Knockout",
    accent: "green",
  },
  {
    id: "t-26",
    slug: "friday-club-night-live",
    name: "Friday Club Night",
    status: "live",
    dateRange: "07 Jun 2027",
    startDate: "2027-06-07",
    players: 16,
    registeredCount: 16,
    registrationOpen: false,
    location: "XYZ Snooker Arena",
    prizePool: "₹10,000",
    entryFee: "Free",
    format: "Knockout",
    accent: "table",
  },
  {
    id: "t-27",
    slug: "national-open-2026",
    name: "National Open 2026",
    status: "completed",
    dateRange: "10 Nov – 20 Nov 2026",
    startDate: "2026-11-10",
    players: 64,
    registeredCount: 64,
    registrationOpen: false,
    location: "XYZ Snooker Arena",
    prizePool: "₹1,50,000",
    entryFee: "₹1,500",
    format: "Knockout",
    accent: "blue",
  },
  {
    id: "t-28",
    slug: "independence-cup-2026",
    name: "Independence Cup 2026",
    status: "completed",
    dateRange: "13 Aug – 15 Aug 2026",
    startDate: "2026-08-13",
    players: 64,
    registeredCount: 64,
    registrationOpen: false,
    location: "XYZ Snooker Arena",
    prizePool: "₹70,000",
    entryFee: "₹800",
    format: "Knockout",
    accent: "purple",
  },
];
