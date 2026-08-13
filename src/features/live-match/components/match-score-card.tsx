import { Calendar, ChevronRight, Clock, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LiveBadge } from "@/components/shared/live-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveClock } from "@/features/live-match/components/live-clock";
import { BallIcon } from "@/features/live-match/components/ball-icon";
import type { LiveMatchView } from "@/features/live-match/types";

function CountryFlag({ code }: { code: string }) {
  if (code.length !== 2) return null;
  const flag = code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      {flag} {code === "IN" ? "India" : code}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{children}</p>
      </div>
    </div>
  );
}

export function MatchScoreCard({ match, startedAtMs }: { match: LiveMatchView; startedAtMs: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {match.isLive ? <LiveBadge /> : null}
            <div>
              <p className="font-heading text-sm font-bold text-foreground">{match.tournamentName}</p>
              <p className="text-xs text-muted-foreground">
                {match.round} &bull; {match.tableLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-3">
            <AvatarInitials name={match.player1.name} photoUrl={match.player1.photoUrl} size="lg" />
            <div>
              <p className="font-heading text-base font-bold text-foreground">{match.player1.name}</p>
              <CountryFlag code={match.player1.country} />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-2">
            <span className="font-tabular text-3xl font-bold text-success">{match.player1.framesWon}</span>
            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Frame</span>
              <span className="font-tabular text-lg font-bold text-foreground">
                {match.currentFrameNumber}
              </span>
              <span className="text-[10px] text-muted-foreground">(Best of {match.bestOf})</span>
            </div>
            <span className="font-tabular text-3xl font-bold text-destructive">{match.player2.framesWon}</span>
          </div>

          <div className="flex items-center justify-end gap-3 text-right">
            <div>
              <p className="font-heading text-base font-bold text-foreground">{match.player2.name}</p>
              <CountryFlag code={match.player2.country} />
            </div>
            <AvatarInitials name={match.player2.name} photoUrl={match.player2.photoUrl} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
          <div className="flex flex-col items-center justify-center rounded-xl bg-success/15 py-4">
            <span className="text-[10px] uppercase tracking-wide text-success">Points</span>
            <span className="font-tabular text-3xl font-bold text-success">{match.player1.points}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 px-2 text-center">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Current Break</span>
            <span className="font-tabular text-2xl font-bold text-primary">{match.currentBreak.points}</span>
            <span className="text-xs text-muted-foreground">
              {match.currentBreak.owner === "player1" ? match.player1.name : match.player2.name}
            </span>
            <div className="flex items-center gap-1">
              {match.currentBreak.balls.map((color, i) => (
                <BallIcon key={i} color={color} size="sm" />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-destructive/15 py-4">
            <span className="text-[10px] uppercase tracking-wide text-destructive">Points</span>
            <span className="font-tabular text-3xl font-bold text-destructive">{match.player2.points}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <InfoItem icon={Trophy} label="Table">
            {match.tableLabel.replace(/[^0-9]/g, "")}
          </InfoItem>
          <InfoItem icon={ChevronRight} label="Round">
            {match.round}
          </InfoItem>
          <InfoItem icon={Calendar} label="Started At">
            {match.startedAt}
          </InfoItem>
          <InfoItem icon={Clock} label="Elapsed Time">
            <LiveClock mode="up" referenceMs={startedAtMs} className="text-success" />
          </InfoItem>
        </div>
      </CardContent>
    </Card>
  );
}
