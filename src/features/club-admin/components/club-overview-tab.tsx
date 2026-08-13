"use client";

import { Award, Calendar, ClipboardList, Crown, Landmark, MapPin, Radio, Trophy, Users, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LiveBadge } from "@/components/shared/live-badge";
import { useClub } from "@/components/shared/club-provider";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import { computeTournamentResults, type TournamentResultPlayer, type TournamentResults } from "@/lib/tournament-results";
import type { ClubTournament } from "@/types/club-tournament";
import type { DrawMatch } from "@/types/match";

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

function resolvePrizeWinner(
  label: string,
  results: ReturnType<typeof computeTournamentResults>,
  semifinalistIndex: { current: number }
): TournamentResultPlayer | null {
  const lower = label.toLowerCase();
  if (lower.includes("winner") || lower.includes("champion")) return results.champion;
  if (lower.includes("runner")) return results.runnerUp;
  if (lower.includes("semi")) {
    const player = results.semifinalists[semifinalistIndex.current] ?? null;
    semifinalistIndex.current += 1;
    return player;
  }
  return null;
}

export function ClubOverviewTab({
  tournament,
  registeredCount,
  clubName,
  liveMatch,
  matches,
  playerPhotos,
  overrideResults,
}: {
  tournament: ClubTournament;
  registeredCount: number;
  clubName: string;
  liveMatch: DrawMatch | null;
  matches: DrawMatch[];
  playerPhotos: Record<string, string>;
  overrideResults?: TournamentResults | null;
}) {
  const { basePath, club } = useClub();
  const results = overrideResults ?? computeTournamentResults(matches);
  const semifinalistIndex = { current: 0 };

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tournament.status === "completed" && results.champion ? (
        <Card className="lg:col-span-3 border-primary/40 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-5 pt-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Crown className="size-5" />
            </span>
            <PlayerLink clubSlug={club.slug} playerId={results.champion.id}>
              <AvatarInitials
                name={results.champion.name}
                photoUrl={playerPhotos[results.champion.id]}
                size="xl"
              />
            </PlayerLink>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Tournament Champion</p>
              <PlayerLink clubSlug={club.slug} playerId={results.champion.id} className="hover:text-primary">
                <p className="font-heading text-2xl font-bold text-foreground">{results.champion.name}</p>
              </PlayerLink>
              {results.runnerUp ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Runner-up:{" "}
                  <PlayerLink clubSlug={club.slug} playerId={results.runnerUp.id} className="hover:text-primary hover:underline">
                    {results.runnerUp.name}
                  </PlayerLink>
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">About Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {tournament.description || "No description added yet."}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Key Information</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <InfoRow icon={Calendar} label="Start Date" value={tournament.startDate ?? "TBA"} />
          <InfoRow icon={Calendar} label="End Date" value={tournament.endDate ?? "TBA"} />
          {tournament.location ? (
            <InfoRow icon={MapPin} label="Venue" value={tournament.location} />
          ) : null}
          <InfoRow icon={ClipboardList} label="Format" value={tournament.format} />
          <InfoRow icon={Users} label="Registered" value={`${registeredCount} / ${tournament.maxPlayers}`} />
          {tournament.prizePool ? (
            <InfoRow icon={Trophy} label="Prize Pool" value={tournament.prizePool} />
          ) : null}
          {tournament.entryFee ? (
            <InfoRow icon={Wallet} label="Entry Fee" value={tournament.entryFee} />
          ) : null}
          <InfoRow icon={Landmark} label="Organizer" value={clubName} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-wide">Next Live Match</CardTitle>
            {liveMatch ? <LiveBadge /> : null}
          </div>
        </CardHeader>
        <CardContent>
          {liveMatch ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                {liveMatch.round} &bull; Table {liveMatch.tableNumber}
              </p>
              <div className="flex items-center justify-between">
                <PlayerLink clubSlug={club.slug} playerId={liveMatch.player1Id} className="flex flex-col items-center gap-2 text-center hover:text-primary">
                  <AvatarInitials
                    name={liveMatch.player1Name}
                    photoUrl={playerPhotos[liveMatch.player1Id]}
                    size="md"
                  />
                  <span className="text-xs font-medium text-foreground">{liveMatch.player1Name}</span>
                </PlayerLink>
                <span className="text-sm font-bold text-muted-foreground">VS</span>
                <PlayerLink clubSlug={club.slug} playerId={liveMatch.player2Id} className="flex flex-col items-center gap-2 text-center hover:text-primary">
                  <AvatarInitials
                    name={liveMatch.player2Name}
                    photoUrl={playerPhotos[liveMatch.player2Id]}
                    size="md"
                  />
                  <span className="text-xs font-medium text-foreground">{liveMatch.player2Name}</span>
                </PlayerLink>
              </div>
              <LinkButton href={`${basePath}/live/${liveMatch.id}`} className="w-full">
                <Radio className="size-3.5" /> Watch Live
              </LinkButton>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No live match right now.
            </p>
          )}
        </CardContent>
      </Card>

      {tournament.prizeBreakdown.length > 0 ? (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide">Prize Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {tournament.prizeBreakdown.map((item, i) => {
              const winner = resolvePrizeWinner(item.label, results, semifinalistIndex);
              return (
                <div
                  key={`${item.label}-${i}`}
                  className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-b-0"
                >
                  <span className="flex items-center gap-2.5 text-muted-foreground">
                    <Award className="size-3.5 text-primary" /> {item.label}
                    {winner ? (
                      <PlayerLink clubSlug={club.slug} playerId={winner.id} className="flex items-center gap-1.5 text-foreground hover:text-primary">
                        <AvatarInitials name={winner.name} photoUrl={playerPhotos[winner.id]} size="sm" />
                        {winner.name}
                      </PlayerLink>
                    ) : null}
                  </span>
                  <span className="font-tabular font-semibold text-foreground">{item.amount}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
