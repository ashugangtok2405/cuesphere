import { getSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/services/profile-service";
import { listMembershipsForUser } from "@/services/club-service";
import { getProfileCompletion } from "@/types/player-profile";
import type { SessionUser } from "@/types/user";
import type { PlayerProfile } from "@/types/player-profile";

export interface Viewer {
  user: SessionUser | null;
  profile: PlayerProfile | null;
  profileCompletionPercent: number;
  isProfileComplete: boolean;
  /** Has this user already created (or been granted) a club of their own —
   * used to hide "Create Your Club" once that's already true. */
  ownsClub: boolean;
}

/** Global viewer — auth + player identity, independent of any club context. */
export async function getViewer(): Promise<Viewer> {
  const user = await getSession();
  if (!user) {
    return { user: null, profile: null, profileCompletionPercent: 0, isProfileComplete: false, ownsClub: false };
  }

  const [profile, memberships] = await Promise.all([
    getProfileByUserId(user.id),
    listMembershipsForUser(user.id),
  ]);
  const completion = getProfileCompletion(profile ?? undefined);

  return {
    user,
    profile: profile ?? null,
    profileCompletionPercent: completion.percent,
    isProfileComplete: completion.isComplete,
    ownsClub: memberships.some((m) => m.role === "club_admin"),
  };
}
