"use client";

import { Calendar, MapPin, Trophy, Users } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { MiniCountdown } from "@/components/shared/mini-countdown";
import { Progress } from "@/components/ui/progress";
import { useClub } from "@/components/shared/club-provider";
import { RegisterButton } from "@/features/tournaments/components/register-button";
import { getMockRegistrationDeadline } from "@/lib/mock/tournaments";
import { cn } from "@/lib/utils";
import type { Tournament } from "@/types/tournament";

const accentStyles: Record<Tournament["accent"], string> = {
  gold: "bg-gradient-to-br from-amber-500/35 via-amber-900/30 to-background",
  red: "bg-gradient-to-br from-red-600/35 via-red-950/35 to-background",
  blue: "bg-gradient-to-br from-blue-600/35 via-blue-950/35 to-background",
  purple: "bg-gradient-to-br from-purple-600/35 via-purple-950/35 to-background",
  green: "bg-gradient-to-br from-emerald-600/35 via-emerald-950/35 to-background",
  table: "felt-texture",
};

function MetaRow({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" /> {children}
    </p>
  );
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { basePath } = useClub();
  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("relative flex h-36 items-center justify-center", accentStyles[tournament.accent])}>
        {tournament.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
            Featured
          </span>
        ) : null}
        <StatusBadge status={tournament.status} className="absolute right-3 top-3" />
        <Trophy className="size-14 text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" strokeWidth={1.3} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
          {tournament.name}
        </h3>

        <div className="flex-1 space-y-1.5">
          <MetaRow icon={Calendar}>{tournament.dateRange}</MetaRow>
          <MetaRow icon={MapPin}>{tournament.location}</MetaRow>
          <MetaRow icon={Trophy}>Prize Pool {tournament.prizePool}</MetaRow>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> {tournament.registeredCount} /{" "}
              {tournament.players} Registered
            </span>
            {tournament.registrationOpen ? (
              <MiniCountdown targetDate={getMockRegistrationDeadline(tournament)} />
            ) : null}
          </div>
          <Progress value={(tournament.registeredCount / tournament.players) * 100} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            Entry Fee <span className="font-semibold text-foreground">{tournament.entryFee}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <LinkButton href={`${basePath}/tournaments/${tournament.slug}`} variant="outline" size="sm">
              View Details
            </LinkButton>
            <RegisterButton tournament={tournament} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
