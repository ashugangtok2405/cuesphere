"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock3,
  Download,
  Loader2,
  MapPin,
  Phone,
  Radio,
  Sparkles,
  Table as TableIcon,
  Trophy,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { useClub } from "@/components/shared/club-provider";
import type { TournamentDetail } from "@/types/tournament-detail";
import type { TournamentRegistration, Payment } from "@/types/registration";
import type { DrawMatch } from "@/types/match";
import type { PlayerStatistics } from "@/types/player-stats";
import { publishDrawAction } from "@/app/actions/draw-actions";
import { simulateMatchResultAction } from "@/app/actions/match-actions";

export function TournamentDashboard({
  tournament,
  registration,
  payment,
  match,
  playerId,
  stats,
}: {
  tournament: TournamentDetail;
  registration: TournamentRegistration;
  payment: Payment | undefined;
  match: DrawMatch | undefined;
  playerId: string;
  stats: PlayerStatistics | undefined;
}) {
  const router = useRouter();
  const { basePath, club } = useClub();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isReporting, setIsReporting] = React.useState(false);
  const drawReleased = !!match;

  async function handlePublishDraw() {
    setIsPublishing(true);
    const result = await publishDrawAction(club.id, tournament.id);
    setIsPublishing(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Draw published!");
    router.refresh();
  }

  async function handleSimulateResult(won: boolean) {
    if (!match) return;
    setIsReporting(true);
    const result = await simulateMatchResultAction(match.id, won);
    setIsReporting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(won ? "Result recorded — you won!" : "Result recorded.");
    router.refresh();
  }

  const opponentName = match
    ? match.player1Id === playerId
      ? match.player2Name
      : match.player1Name
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border felt-texture p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">My Tournament</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{tournament.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
              Registration: {registration.status === "confirmed" ? "Confirmed" : "Pending Approval"}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
              Payment: {payment?.status === "paid" ? "Paid" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {match?.status === "completed" ? (
        <Card className="border-success/40">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Trophy className="size-6" />
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">
                  {match.winnerId === playerId ? "You won your match!" : "Match complete"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Final score {match.score} against {opponentName}. Your statistics have been updated.
                </p>
              </div>
            </div>
            {stats ? (
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
                <StatBox label="Wins" value={stats.wins} />
                <StatBox label="Ranking Points" value={stats.rankingPoints} />
                <StatBox label="Highest Break" value={stats.highestBreak} />
                <StatBox label="Matches Played" value={stats.matchesPlayed} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : !drawReleased ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide">Draw Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <Sparkles className="size-8 text-primary" />
            <p className="font-heading text-lg font-semibold text-foreground">
              Waiting for Draw Release
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              The tournament bracket will be published shortly. You&apos;ll see your round, opponent
              and table here as soon as it&apos;s live.
            </p>
            <CountdownTimer targetDate={tournament.drawReleaseDate} label="Draw Releases In" />

            <div className="mt-4 w-full max-w-sm rounded-xl border border-dashed border-border p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Demo control — stands in for the admin panel
              </p>
              <Button onClick={handlePublishDraw} disabled={isPublishing} className="w-full" variant="outline">
                {isPublishing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Simulate: Publish Draw
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm uppercase tracking-wide">{match!.round}</CardTitle>
              <StatusBadge status={match!.status === "live" ? "live" : "upcoming"} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 text-center">
                <AvatarInitials name={match!.player1Name} size="lg" />
                <span className="text-sm font-medium text-foreground">{match!.player1Name}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">VS</span>
              <div className="flex flex-col items-center gap-2 text-center">
                <AvatarInitials name={match!.player2Name} size="lg" />
                <span className="text-sm font-medium text-foreground">{match!.player2Name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-background/40 p-3">
                <TableIcon className="mx-auto size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Table</p>
                <p className="font-tabular text-sm font-bold text-foreground">{match!.tableNumber}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-3">
                <Clock3 className="mx-auto size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Reporting</p>
                <p className="text-sm font-bold text-foreground">{match!.reportingTime}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-3">
                <Clock3 className="mx-auto size-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Match Starts</p>
                <p className="text-sm font-bold text-foreground">{match!.matchStartTime}</p>
              </div>
            </div>

            <LinkButton href={`${basePath}/live/${match!.id}`} className="w-full">
              <Radio className="size-4" /> Go To Live Match
            </LinkButton>

            <div className="rounded-xl border border-dashed border-border p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Demo control — stands in for the admin panel
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isReporting}
                  onClick={() => handleSimulateResult(true)}
                >
                  Simulate: I Won
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isReporting}
                  onClick={() => handleSimulateResult(false)}
                >
                  Simulate: I Lost
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide">Rules &amp; Downloads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {tournament.rules.slice(0, 3).map((rule, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  &bull; {rule}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="size-3.5" /> Download Rulebook
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide">Contact Organizer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4 text-primary" /> {tournament.contactPerson}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-primary" /> {tournament.contactNumber}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" /> {tournament.location}, {tournament.venueCity}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
      <p className="font-tabular text-xl font-bold text-primary">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
