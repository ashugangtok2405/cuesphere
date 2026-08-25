"use client";

import Image from "next/image";
import { Calendar, CheckCircle2, MapPin, Trophy, Users, UserRound } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { clubPath } from "@/lib/club-path";
import type { ClubTournament } from "@/types/club-tournament";

export type ClubTournamentCardData = ClubTournament & {
  registeredCount: number;
  isRegistered: boolean;
  clubSlug: string;
  clubName: string;
  friendsRegisteredCount?: number;
};

function MetaRow({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" /> {children}
    </p>
  );
}

function dateRange(tournament: ClubTournament): string | null {
  if (tournament.startDate && tournament.endDate && tournament.startDate !== tournament.endDate) {
    return `${tournament.startDate} – ${tournament.endDate}`;
  }
  return tournament.startDate ?? null;
}

export function ClubTournamentCard({
  tournament,
  showClubName,
}: {
  tournament: ClubTournamentCardData;
  showClubName?: boolean;
}) {
  const range = dateRange(tournament);

  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-primary/30 via-background to-background">
        {tournament.imageUrl ? (
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <Trophy className="size-14 text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" strokeWidth={1.3} />
        )}
        <StatusBadge status={tournament.status} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {showClubName ? (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
              {tournament.clubName}
            </p>
          ) : null}
          <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
            {tournament.name}
          </h3>
        </div>

        <div className="flex-1 space-y-1.5">
          {range ? <MetaRow icon={Calendar}>{range}</MetaRow> : null}
          {tournament.location ? <MetaRow icon={MapPin}>{tournament.location}</MetaRow> : null}
          {tournament.prizePool ? (
            <MetaRow icon={Trophy}>Prize Pool {tournament.prizePool}</MetaRow>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5 text-primary" /> {tournament.registeredCount} /{" "}
            {tournament.maxPlayers} Registered
          </p>
          <Progress
            value={(tournament.registeredCount / tournament.maxPlayers) * 100}
            className="h-1.5"
          />
        </div>

        {tournament.isRegistered ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
            <CheckCircle2 className="size-3.5" /> You&apos;re Registered
          </div>
        ) : null}

        {tournament.friendsRegisteredCount ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
            <UserRound className="size-3.5" />
            {tournament.friendsRegisteredCount === 1
              ? "1 friend is playing"
              : `${tournament.friendsRegisteredCount} friends are playing`}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          {tournament.entryFee ? (
            <p className="text-xs text-muted-foreground">
              Entry Fee <span className="font-semibold text-foreground">{tournament.entryFee}</span>
            </p>
          ) : (
            <span />
          )}
          <LinkButton
            href={clubPath(tournament.clubSlug, `/tournaments/${tournament.slug}`)}
            variant="outline"
            size="sm"
          >
            View Details
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
