import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PlatformHeader } from "@/components/layout/platform-header";
import { PlatformFooter } from "@/components/layout/platform-footer";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";
import { Users } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getProfileByUserIdForDisplay } from "@/services/profile-service";
import { listFriendshipsForUser } from "@/services/friendship-service";
import { getClubById } from "@/services/club-service";
import { FriendsPageClient } from "@/features/platform/components/friends-page-client";
import type { PlayerDirectoryEntry } from "@/features/platform/components/players-browse-client";

export const metadata: Metadata = { title: "My Friends" };

export default async function FriendsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=%2Ffriends");

  const friendships = await listFriendshipsForUser(session.id);

  const entries = (
    await Promise.all(
      friendships.map(async (f) => {
        const otherUserId = f.requesterId === session.id ? f.recipientId : f.requesterId;
        const profile = await getProfileByUserIdForDisplay(otherUserId);
        if (!profile) return null;
        const relation: PlayerDirectoryEntry["relation"] =
          f.status === "accepted" ? "friends" : f.requesterId === session.id ? "outgoing" : "incoming";
        const primaryClub = profile.primaryClubId ? await getClubById(profile.primaryClubId) : undefined;
        return { profile, relation, friendshipId: f.id, primaryClubName: primaryClub?.name };
      })
    )
  ).filter((e): e is NonNullable<typeof e> => e !== null);

  const friends = entries.filter((e) => e.relation === "friends");
  const incoming = entries.filter((e) => e.relation === "incoming");
  const outgoing = entries.filter((e) => e.relation === "outgoing");

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">My Friends</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Friends registered for a tournament show up right on the tournament card.
              </p>
            </div>
            <LinkButton href="/players" variant="outline" size="sm">
              Find Players
            </LinkButton>
          </div>

          {entries.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon={<Users className="size-6" />}
              title="No friends yet"
              description="Browse the player directory and send a few friend requests."
              action={<LinkButton href="/players">Browse Players</LinkButton>}
            />
          ) : (
            <div className="mt-8">
              <FriendsPageClient friends={friends} incoming={incoming} outgoing={outgoing} />
            </div>
          )}
        </div>
      </main>
      <PlatformFooter />
    </div>
  );
}
