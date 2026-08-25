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
      <div className="relative h-14 shrink-0 overflow-hidden felt-texture sm:h-20">
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
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
        {badge ? (
          <span className="absolute right-2 top-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary backdrop-blur-sm sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {badge}
          </span>
        ) : null}
        {club.status !== "approved" ? (
          <span className="absolute left-2 top-2 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {club.status}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 sm:gap-2 sm:px-5 sm:pb-5">
        <div className="relative z-10 -mt-5 flex items-end gap-3 sm:-mt-7">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card shadow-lg ring-1 ring-border sm:size-12 sm:border-4",
              club.logoUrl ? "bg-white" : "bg-background"
            )}
          >
            {club.logoUrl ? (
              <Image src={club.logoUrl} alt={club.name} width={48} height={48} className="size-full object-contain p-1" />
            ) : (
              <Trophy className="size-4 text-primary sm:size-5" strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate font-heading text-xs font-bold text-foreground sm:text-base">{club.name}</p>
          {club.tagline ? (
            <p className="truncate text-[9px] font-medium uppercase tracking-wide text-primary/80 sm:text-[11px]">
              {club.tagline}
            </p>
          ) : club.address ? (
            <p className="flex items-center gap-1 truncate text-[10px] text-muted-foreground sm:text-xs">
              <MapPin className="size-2.5 shrink-0 text-primary sm:size-3" />
              <span className="truncate">{club.address}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-border pt-1.5 text-[10px] text-muted-foreground sm:mt-1 sm:gap-x-4 sm:pt-2.5 sm:text-xs">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <Trophy className="size-3 text-primary sm:size-3.5" />
            <span className="font-tabular font-semibold text-foreground">{tournamentCount}</span>
            <span className="hidden sm:inline">Tournaments</span>
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <Users className="size-3 text-primary sm:size-3.5" />
            <span className="font-tabular font-semibold text-foreground">{memberCount}</span>
            <span className="hidden sm:inline">Members</span>
          </span>
        </div>

        <LinkButton href={`/c/${club.slug}`} size="sm" className="mt-0.5 h-8 text-xs sm:mt-1 sm:h-9 sm:text-sm">
          Visit Club
        </LinkButton>
      </div>
    </div>
  );
}
