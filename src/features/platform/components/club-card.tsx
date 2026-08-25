import Image from "next/image";
import { MapPin, Trophy, Users } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/club";

export function ClubCard({
  club,
  tournamentCount,
  memberCount,
  badge,
}: {
  club: Club;
  tournamentCount: number;
  memberCount: number;
  /** Optional small label shown top-right of the banner, e.g. a role like "Club Admin". */
  badge?: string;
}) {
  return (
    <div className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
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
        {badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
        {club.status !== "approved" ? (
          <span className="absolute left-3 top-3 rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-warning backdrop-blur-sm">
            {club.status}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="-mt-9 flex items-end gap-3">
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card shadow-lg ring-1 ring-border",
              club.logoUrl ? "bg-white" : "bg-background"
            )}
          >
            {club.logoUrl ? (
              <Image src={club.logoUrl} alt={club.name} width={64} height={64} className="size-full object-contain p-1.5" />
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
  );
}
