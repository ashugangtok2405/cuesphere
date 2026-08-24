"use client";

import * as React from "react";
import Image from "next/image";
import { Building2, MapPin, Search, Trophy, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ club, tournamentCount, memberCount }) => (
            <div
              key={club.id}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-28 shrink-0 overflow-hidden felt-texture">
                {club.heroBannerUrl ? (
                  <Image
                    src={club.heroBannerUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-grid-fade opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
                <div className="-mt-9 flex items-end gap-3">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-card bg-background shadow-lg ring-1 ring-border">
                    {club.logoUrl ? (
                      <Image src={club.logoUrl} alt={club.name} width={64} height={64} className="size-full object-cover" />
                    ) : (
                      <Trophy className="size-6 text-primary" strokeWidth={1.5} />
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="truncate font-heading text-lg font-bold text-foreground">{club.name}</p>
                  {club.tagline ? (
                    <p className="truncate text-xs font-medium uppercase tracking-wide text-primary/80">
                      {club.tagline}
                    </p>
                  ) : null}
                </div>

                {club.description ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{club.description}</p>
                ) : null}

                {club.address ? (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{club.address}</span>
                  </p>
                ) : null}

                <div className="mt-1 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="size-3.5 text-primary" />
                    <span className="font-tabular font-semibold text-foreground">{tournamentCount}</span> Tournaments
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span className="font-tabular font-semibold text-foreground">{memberCount}</span> Members
                  </span>
                </div>

                <LinkButton href={`/c/${club.slug}`} size="sm" className="mt-1">
                  Visit Club
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
