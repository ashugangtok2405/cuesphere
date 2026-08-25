"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClubOverviewTab } from "@/features/club-admin/components/club-overview-tab";
import { ClubPlayersTab } from "@/features/club-admin/components/club-players-tab";
import { ClubFixturesTab } from "@/features/club-admin/components/club-fixtures-tab";
import { ClubLiveTab } from "@/features/club-admin/components/club-live-tab";
import { ClubResultsTab } from "@/features/club-admin/components/club-results-tab";
import { ClubRulesTab } from "@/features/club-admin/components/club-rules-tab";
import type { ClubTournament } from "@/types/club-tournament";
import type { DrawMatch } from "@/types/match";
import type { PlayerProfile } from "@/types/player-profile";
import type { TournamentRegistration } from "@/types/registration";
import type { TournamentResults } from "@/lib/tournament-results";

const TRIGGER_CLASS =
  "px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground after:h-[2px] after:bg-primary data-active:text-primary sm:text-sm";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "players", label: "Players" },
  { value: "fixtures", label: "Fixtures" },
  { value: "live", label: "Live" },
  { value: "results", label: "Results" },
  { value: "rules", label: "Rules" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function ClubTournamentTabs({
  clubSlug,
  tournament,
  clubName,
  registeredCount,
  players,
  matches,
  playerPhotos,
  overrideResults,
  canManagePayments = false,
}: {
  clubSlug: string;
  tournament: ClubTournament;
  clubName: string;
  registeredCount: number;
  players: { registration: TournamentRegistration; profile: PlayerProfile | undefined }[];
  matches: DrawMatch[];
  playerPhotos: Record<string, string>;
  overrideResults?: TournamentResults | null;
  canManagePayments?: boolean;
}) {
  const [active, setActive] = useState<TabValue>("overview");
  const liveMatch = matches.find((m) => m.status === "live") ?? null;

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as TabValue)} className="mt-6">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className={TRIGGER_CLASS}>
            {tab.label}
            {tab.value === "players" ? ` (${registeredCount})` : ""}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={active} className="pt-6">
        {active === "overview" && (
          <ClubOverviewTab
            tournament={tournament}
            registeredCount={registeredCount}
            clubName={clubName}
            liveMatch={liveMatch}
            matches={matches}
            playerPhotos={playerPhotos}
            overrideResults={overrideResults}
          />
        )}
        {active === "players" && (
          <ClubPlayersTab clubSlug={clubSlug} players={players} canManagePayments={canManagePayments} />
        )}
        {active === "fixtures" && <ClubFixturesTab clubSlug={clubSlug} matches={matches} playerPhotos={playerPhotos} />}
        {active === "live" && <ClubLiveTab matches={matches} playerPhotos={playerPhotos} />}
        {active === "results" && <ClubResultsTab clubSlug={clubSlug} matches={matches} playerPhotos={playerPhotos} />}
        {active === "rules" && <ClubRulesTab description={tournament.description} />}
      </TabsContent>
    </Tabs>
  );
}
