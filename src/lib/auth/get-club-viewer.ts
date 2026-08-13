import { getSession } from "@/lib/auth/session";
import { getClubBySlug, getMembership } from "@/services/club-service";
import { getProfileByUserId } from "@/services/profile-service";
import { getUnreadCount } from "@/services/notification-service";
import { getRegistrationsForPlayer } from "@/services/registration-service";
import { getPlayerCurrentMatch } from "@/services/match-service";
import { isStaffRole, type Club, type ClubMembership } from "@/types/club";

export interface ClubViewer {
  club: Club;
  membership: ClubMembership | null;
  isStaff: boolean;
  unreadNotifications: number;
  activeRegistrationId: string | null;
  currentMatchId: string | null;
}

/** Club-scoped viewer — resolves the club by slug and the caller's role in it. */
export async function getClubViewer(clubSlug: string): Promise<ClubViewer | null> {
  const club = await getClubBySlug(clubSlug);
  if (!club) return null;

  const user = await getSession();
  if (!user) {
    return { club, membership: null, isStaff: false, unreadNotifications: 0, activeRegistrationId: null, currentMatchId: null };
  }

  const membership = (await getMembership(club.id, user.id)) ?? null;
  const profile = await getProfileByUserId(user.id);
  const registrations = profile ? await getRegistrationsForPlayer(profile.id, club.id) : [];
  const activeRegistration = registrations[0];
  const currentMatch =
    profile && activeRegistration
      ? await getPlayerCurrentMatch(activeRegistration.tournamentId, profile.id)
      : undefined;

  return {
    club,
    membership,
    isStaff: isStaffRole(membership?.role),
    unreadNotifications: await getUnreadCount(user.id, club.id),
    activeRegistrationId: activeRegistration?.id ?? null,
    currentMatchId: currentMatch?.id ?? null,
  };
}
