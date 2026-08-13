import { redirect } from "next/navigation";
import { Radio } from "lucide-react";

import { clubPath } from "@/lib/club-path";
import { getClubBySlug } from "@/services/club-service";
import { getLiveMatchForClub } from "@/services/match-service";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";

export default async function LiveIndexPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;

  // XYZ Snooker Club keeps its original, always-on demo live match.
  if (clubSlug === "xyz-snooker-club") {
    redirect(clubPath(clubSlug, "/live/table-2"));
  }

  const club = await getClubBySlug(clubSlug);
  if (!club) return null;

  const match = await getLiveMatchForClub(club.id);
  if (match) {
    redirect(clubPath(clubSlug, `/live/${match.id}`));
  }

  return (
    <>
      <PageHero
        title="Live Matches"
        description={`Follow live scoring from ${club.name}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Live Matches" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          icon={<Radio className="size-6" />}
          title="No live matches right now"
          description={`${club.name} doesn't have a match in progress at the moment. Check back once a tournament is underway.`}
        />
      </div>
    </>
  );
}
