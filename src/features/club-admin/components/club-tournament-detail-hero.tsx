"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { LinkButton } from "@/components/shared/link-button";
import { useViewer } from "@/components/shared/viewer-provider";
import { useClub } from "@/components/shared/club-provider";
import { registerForClubTournamentAction } from "@/app/actions/club-tournament-actions";
import type { ClubTournament } from "@/types/club-tournament";

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

function dateRange(tournament: ClubTournament): string {
  if (tournament.startDate && tournament.endDate && tournament.startDate !== tournament.endDate) {
    return `${tournament.startDate} – ${tournament.endDate}`;
  }
  return tournament.startDate ?? "Date TBA";
}

export function ClubTournamentDetailHero({
  tournament,
  registeredCount,
  isRegistered,
  hasStarted,
}: {
  tournament: ClubTournament;
  registeredCount: number;
  isRegistered: boolean;
  hasStarted: boolean;
}) {
  const router = useRouter();
  const viewer = useViewer();
  const { club, basePath } = useClub();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleRegister() {
    if (!viewer.user) {
      router.push(`${basePath}/login?redirect=${encodeURIComponent(`${basePath}/tournaments/${tournament.slug}`)}`);
      return;
    }
    if (!viewer.isProfileComplete) {
      router.push(`${basePath}/account/profile?redirect=${encodeURIComponent(`${basePath}/tournaments/${tournament.slug}`)}`);
      return;
    }

    setIsSubmitting(true);
    const result = await registerForClubTournamentAction(club.slug, tournament.slug);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Registered! Good luck.");
    router.refresh();
  }

  const canRegister = tournament.registrationOpen && !hasStarted;

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
              <Calendar className="size-4 text-primary" /> {dateRange(tournament)}
            </span>
            {tournament.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" /> {tournament.location}
              </span>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <InfoItem icon={ClipboardList} label="Format" value={tournament.format} />
            <InfoItem icon={Users} label="Players" value={`${registeredCount} / ${tournament.maxPlayers}`} />
            {tournament.prizePool ? (
              <InfoItem icon={Trophy} label="Prize Pool" value={tournament.prizePool} />
            ) : null}
            {tournament.entryFee ? (
              <InfoItem icon={Wallet} label="Entry Fee" value={tournament.entryFee} />
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LinkButton href={`${basePath}/tournaments`} variant="outline">
              <ArrowLeft className="size-4" /> Back
            </LinkButton>

            {isRegistered ? (
              <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                <CheckCircle2 className="size-4" /> You&apos;re Registered
              </div>
            ) : (
              <Button disabled={!canRegister || isSubmitting} onClick={handleRegister}>
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                {hasStarted
                  ? "Tournament Has Started"
                  : tournament.registrationOpen
                    ? "Register Now"
                    : "Registration Closed"}
              </Button>
            )}
          </div>
        </div>

        {tournament.status === "live" && tournament.endDate ? (
          <CountdownTimer targetDate={tournament.endDate} label="Tournament Ends In" className="lg:shrink-0" />
        ) : tournament.status === "upcoming" && tournament.startDate ? (
          <CountdownTimer targetDate={tournament.startDate} label="Tournament Starts In" className="lg:shrink-0" />
        ) : null}
      </div>
    </section>
  );
}
