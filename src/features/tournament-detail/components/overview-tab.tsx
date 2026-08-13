"use client";

import {
  Award,
  Calendar,
  ClipboardList,
  Download,
  Landmark,
  LayoutGrid,
  MapPin,
  Radio,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveBadge } from "@/components/shared/live-badge";
import { useClub } from "@/components/shared/club-provider";
import { ProgressStepper } from "@/features/tournament-detail/components/progress-stepper";
import { cn } from "@/lib/utils";
import type { TournamentDetail } from "@/types/tournament-detail";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function OverviewTab({ tournament }: { tournament: TournamentDetail }) {
  const { basePath } = useClub();
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">About Tournament</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{tournament.aboutText}</p>
          <LinkButton href="#rules" variant="outline" size="sm">
            Download Rulebook <Download className="size-3.5" />
          </LinkButton>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide">Tournament Progress</CardTitle>
            <span className="text-xs font-semibold text-primary">{tournament.currentStageLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressStepper stages={tournament.progress} />
          <p className="text-xs text-muted-foreground">
            {tournament.matchesCompleted} of {tournament.totalMatches} matches completed
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Current Champion</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <AvatarInitials name={tournament.currentChampion.name} size="xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="font-heading text-lg font-bold text-foreground">
                {tournament.currentChampion.name}
              </p>
              <p className="text-xs text-muted-foreground">{tournament.currentChampion.subtitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Key Information</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <InfoRow icon={Calendar} label="Tournament" value={tournament.name} />
          <InfoRow icon={Calendar} label="Start Date" value={tournament.dateRange.split("–")[0].trim()} />
          <InfoRow icon={Calendar} label="End Date" value={tournament.dateRange.split("–")[1]?.trim() ?? "—"} />
          <InfoRow icon={MapPin} label="Venue" value={`${tournament.location}, ${tournament.venueCity}`} />
          <InfoRow icon={LayoutGrid} label="Tables" value={`${tournament.tables} Professional Tables`} />
          <InfoRow icon={ClipboardList} label="Format" value={tournament.format} />
          <InfoRow icon={Users} label="Total Players" value={tournament.players} />
          <InfoRow icon={Trophy} label="Prize Pool" value={tournament.prizePool} />
          <InfoRow icon={Wallet} label="Entry Fee" value={tournament.entryFee} />
          <InfoRow icon={Landmark} label="Organizer" value={tournament.organizer} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Prize Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {tournament.prizeBreakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-b-0"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Award className="size-3.5 text-primary" /> {item.label}
              </span>
              <span className="font-tabular font-semibold text-foreground">{item.amount}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm font-semibold text-foreground">Total Prize Pool</span>
            <span className="font-tabular text-lg font-bold text-success">{tournament.prizePool}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide">Next Live Match</CardTitle>
            {tournament.nextMatch?.isLive ? <LiveBadge /> : null}
          </div>
        </CardHeader>
        <CardContent>
          {tournament.nextMatch ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                {tournament.nextMatch.round} &bull; {tournament.nextMatch.table}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-2 text-center">
                  <AvatarInitials name={tournament.nextMatch.players[0].name} size="md" />
                  <span className="text-xs font-medium text-foreground">
                    {tournament.nextMatch.players[0].name}
                  </span>
                </div>
                <span className="text-sm font-bold text-muted-foreground">VS</span>
                <div className="flex flex-col items-center gap-2 text-center">
                  <AvatarInitials name={tournament.nextMatch.players[1].name} size="md" />
                  <span className="text-xs font-medium text-foreground">
                    {tournament.nextMatch.players[1].name}
                  </span>
                </div>
              </div>
              <LinkButton href={`${basePath}/live/table-2`} className="w-full">
                <Radio className="size-3.5" /> Watch Live
              </LinkButton>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No live match scheduled right now.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide">Past Champions</CardTitle>
            <LinkButton href={`${basePath}/hall-of-fame`} variant="outline" size="sm">
              View All
            </LinkButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {tournament.pastChampions.map((champion, i) => (
              <div
                key={champion.year}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-border bg-background/40 p-3 text-center",
                  i === 0 && "border-primary/60 bg-primary/5"
                )}
              >
                <AvatarInitials name={champion.name} size="lg" />
                <p className="text-xs font-semibold text-foreground">{champion.name}</p>
                <p className="text-[11px] text-muted-foreground">{champion.year}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide">Tournament Sponsors</CardTitle>
            <LinkButton href={`${basePath}/contact`} variant="outline" size="sm">
              View All
            </LinkButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {tournament.sponsorNames.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-lg border border-border bg-background/40 px-3 py-3 text-center text-xs font-semibold text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
