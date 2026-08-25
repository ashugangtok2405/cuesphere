"use client";

import * as React from "react";
import { Building2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ClubCard } from "@/features/platform/components/club-card";
import type { Club } from "@/types/club";

export interface ClubBrowseEntry {
  club: Club;
  tournamentCount: number;
  memberCount: number;
}

export function ClubsBrowseClient({ clubs }: { clubs: ClubBrowseEntry[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = clubs.filter(({ club }) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      club.name.toLowerCase().includes(q) ||
      club.tagline.toLowerCase().includes(q) ||
      club.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clubs by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {clubs.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-6" />}
          title="No clubs yet"
          description="Be the first to bring your club onto CueSphere."
          action={<LinkButton href="/clubs/new">Create Your Club</LinkButton>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" />}
          title="No clubs match your search"
          description="Try a different name or location."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(({ club, tournamentCount, memberCount }) => (
            <ClubCard key={club.id} club={club} tournamentCount={tournamentCount} memberCount={memberCount} />
          ))}
        </div>
      )}
    </div>
  );
}
