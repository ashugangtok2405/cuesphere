import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { getClubById, listMembershipsForUser } from "@/services/club-service";
import { PlatformHeader } from "@/components/layout/platform-header";
import { PlatformFooter } from "@/components/layout/platform-footer";
import { EmptyState } from "@/components/shared/empty-state";
import { LinkButton } from "@/components/shared/link-button";

export const metadata: Metadata = { title: "My Clubs" };

const ROLE_LABELS: Record<string, string> = {
  club_admin: "Club Admin",
  club_staff_receptionist: "Receptionist",
  club_staff_referee: "Referee",
  club_staff_scorekeeper: "Score Keeper",
  player: "Player",
};

export default async function MyClubsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=%2Fmy-clubs");
  }

  const memberships = await listMembershipsForUser(session.id);
  const clubs = await Promise.all(
    memberships.map(async (m) => ({
      membership: m,
      club: await getClubById(m.clubId),
    }))
  );
  const validClubs = clubs.filter((c) => c.club);

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">My Clubs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every club you&apos;ve joined, across CueSphere.
          </p>

          {validClubs.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon={<Building2 className="size-6" />}
              title="You haven't joined any clubs yet"
              description="Browse clubs from the homepage and join one to get started."
              action={<LinkButton href="/clubs">Browse Clubs</LinkButton>}
            />
          ) : (
            <div className="mt-8 space-y-3">
              {validClubs.map(({ club, membership }) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{club!.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_LABELS[membership.role] ?? membership.role}
                      {club!.status !== "approved" ? ` · ${club!.status}` : ""}
                    </p>
                  </div>
                  <LinkButton href={`/c/${club!.slug}`} variant="outline" size="sm">
                    Visit
                  </LinkButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <PlatformFooter />
    </div>
  );
}
