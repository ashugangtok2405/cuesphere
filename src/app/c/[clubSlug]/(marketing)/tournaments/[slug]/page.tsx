import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TournamentDetailHero } from "@/features/tournament-detail/components/tournament-detail-hero";
import { TournamentTabs } from "@/features/tournament-detail/components/tournament-tabs";
import { getTournamentDetail } from "@/lib/mock/tournament-detail";
import { clubPath } from "@/lib/club-path";
import { getClubBySlug } from "@/services/club-service";
import {
  getClubTournamentBySlug,
  countRegisteredForClubTournament,
} from "@/services/club-tournament-service";
import { getSession } from "@/lib/auth/session";
import { getProfileByUserId, getProfileById } from "@/services/profile-service";
import { getRegistrationForPlayer, getRegistrationsForTournament } from "@/services/registration-service";
import { getMatchesForTournament } from "@/services/match-service";
import { ClubTournamentDetailHero } from "@/features/club-admin/components/club-tournament-detail-hero";
import { ClubTournamentTabs } from "@/features/club-admin/components/club-tournament-tabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubSlug: string; slug: string }>;
}): Promise<Metadata> {
  const { clubSlug, slug } = await params;
  if (clubSlug === "xyz-snooker-club") {
    const tournament = getTournamentDetail(slug);
    return { title: tournament?.name ?? "Tournament" };
  }
  const club = await getClubBySlug(clubSlug);
  const tournament = club ? await getClubTournamentBySlug(club.id, slug) : undefined;
  return { title: tournament?.name ?? "Tournament" };
}

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ clubSlug: string; slug: string }>;
}) {
  const { clubSlug, slug } = await params;

  if (clubSlug === "xyz-snooker-club") {
    const tournament = getTournamentDetail(slug);
    if (!tournament) notFound();

    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <a href={clubPath(clubSlug)} className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <a href={clubPath(clubSlug, "/tournaments")} className="hover:text-foreground">
            Tournaments
          </a>
          <span>/</span>
          <span className="font-medium text-primary">{tournament.name}</span>
        </nav>

        <TournamentDetailHero tournament={tournament} />
        <TournamentTabs tournament={tournament} />
      </div>
    );
  }

  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  const tournament = await getClubTournamentBySlug(club.id, slug);
  if (!tournament) notFound();

  const session = await getSession();
  const profile = session ? await getProfileByUserId(session.id) : undefined;
  const [existingRegistration, registeredCount, registrations, matches] = await Promise.all([
    profile ? getRegistrationForPlayer(tournament.id, profile.id) : Promise.resolve(undefined),
    countRegisteredForClubTournament(tournament.id),
    getRegistrationsForTournament(tournament.id),
    getMatchesForTournament(tournament.id),
  ]);

  const players = await Promise.all(
    registrations.map(async (r) => ({
      registration: r,
      profile: await getProfileById(r.playerId),
    }))
  );

  const hasStarted = !!tournament.startDate && new Date(tournament.startDate) <= new Date();

  const playerPhotos: Record<string, string> = {};
  for (const { registration, profile } of players) {
    if (profile?.profilePhotoUrl) playerPhotos[registration.playerId] = profile.profilePhotoUrl;
  }

  const overrideResults = tournament.championId
    ? await (async () => {
        const [championProfile, runnerUpProfile] = await Promise.all([
          getProfileById(tournament.championId as string),
          tournament.runnerUpId ? getProfileById(tournament.runnerUpId) : Promise.resolve(undefined),
        ]);
        if (!championProfile) return null;
        if (championProfile.profilePhotoUrl) playerPhotos[championProfile.id] = championProfile.profilePhotoUrl;
        if (runnerUpProfile?.profilePhotoUrl) playerPhotos[runnerUpProfile.id] = runnerUpProfile.profilePhotoUrl;
        return {
          champion: { id: championProfile.id, name: championProfile.fullName },
          runnerUp: runnerUpProfile ? { id: runnerUpProfile.id, name: runnerUpProfile.fullName } : null,
          semifinalists: [],
        };
      })()
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <a href={clubPath(clubSlug)} className="hover:text-foreground">
          Home
        </a>
        <span>/</span>
        <a href={clubPath(clubSlug, "/tournaments")} className="hover:text-foreground">
          Tournaments
        </a>
        <span>/</span>
        <span className="font-medium text-primary">{tournament.name}</span>
      </nav>

      <ClubTournamentDetailHero
        tournament={tournament}
        registeredCount={registeredCount}
        isRegistered={!!existingRegistration}
        hasStarted={hasStarted}
      />
      <ClubTournamentTabs
        clubSlug={clubSlug}
        tournament={tournament}
        clubName={club.name}
        registeredCount={registeredCount}
        players={players}
        matches={matches}
        playerPhotos={playerPhotos}
        overrideResults={overrideResults}
      />
    </div>
  );
}
