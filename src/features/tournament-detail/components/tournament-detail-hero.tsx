"use client";

import { Calendar, MapPin, ClipboardList, Users, Trophy, Wallet, Building2, ArrowLeft } from "lucide-react";

import { CountdownTimer } from "@/components/shared/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { LinkButton } from "@/components/shared/link-button";
import { useClub } from "@/components/shared/club-provider";
import { RegisterButton } from "@/features/tournaments/components/register-button";
import type { TournamentDetail } from "@/types/tournament-detail";

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" />
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function TournamentDetailHero({ tournament }: { tournament: TournamentDetail }) {
  const { basePath } = useClub();
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border">
      <div className="absolute inset-0 felt-texture" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
      <Trophy
        className="pointer-events-none absolute right-6 top-1/2 hidden size-28 -translate-y-1/2 text-primary drop-shadow-[0_0_30px_rgba(212,175,55,0.45)] lg:block"
        strokeWidth={1.2}
      />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
        <div>
          <StatusBadge status={tournament.status} />
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{tournament.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-primary" /> {tournament.dateRange}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" /> {tournament.location}, {tournament.venueCity}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <InfoItem icon={ClipboardList} label="Format" value={tournament.format} />
            <InfoItem icon={Users} label="Players" value={tournament.players} />
            <InfoItem icon={Trophy} label="Prize Pool" value={tournament.prizePool} />
            <InfoItem icon={Wallet} label="Entry Fee" value={tournament.entryFee} />
            <InfoItem icon={Building2} label="Organizer" value={tournament.organizer} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LinkButton href={`${basePath}/tournaments`} variant="outline">
              <ArrowLeft className="size-4" /> Back
            </LinkButton>
            {tournament.registrationOpen ? (
              <RegisterButton tournament={tournament} size="default" label="Register Now" />
            ) : null}
          </div>
        </div>

        {tournament.status === "live" ? (
          <CountdownTimer targetDate={tournament.endsAt} className="lg:shrink-0" />
        ) : null}
      </div>
    </section>
  );
}
