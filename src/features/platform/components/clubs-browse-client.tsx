"use client";

import * as React from "react";
import Image from "next/image";
import { Building2, MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import type { Club } from "@/types/club";

export function ClubsBrowseClient({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = clubs.filter((club) => {
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <div
              key={club.id}
              className="card-hover flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                  {club.logoUrl ? (
                    <Image src={club.logoUrl} alt={club.name} width={48} height={48} className="size-full object-cover" />
                  ) : (
                    <Building2 className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-bold text-foreground">{club.name}</p>
                  {club.tagline ? (
                    <p className="truncate text-xs text-muted-foreground">{club.tagline}</p>
                  ) : null}
                </div>
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

              <LinkButton href={`/c/${club.slug}`} variant="outline" size="sm" className="mt-1">
                Visit Club
              </LinkButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
