"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/features/tournament-detail/components/overview-tab";
import { PlayersTab } from "@/features/tournament-detail/components/players-tab";
import { FixturesTab } from "@/features/tournament-detail/components/fixtures-tab";
import { LiveTab } from "@/features/tournament-detail/components/live-tab";
import { ResultsTab } from "@/features/tournament-detail/components/results-tab";
import { GalleryTab } from "@/features/tournament-detail/components/gallery-tab";
import { StatsTab } from "@/features/tournament-detail/components/stats-tab";
import { SponsorsTab } from "@/features/tournament-detail/components/sponsors-tab";
import { RulesTab } from "@/features/tournament-detail/components/rules-tab";
import type { TournamentDetail } from "@/types/tournament-detail";

const TRIGGER_CLASS =
  "px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground after:h-[2px] after:bg-primary data-active:text-primary sm:text-sm";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "players", label: "Players" },
  { value: "fixtures", label: "Fixtures" },
  { value: "live", label: "Live" },
  { value: "results", label: "Results" },
  { value: "gallery", label: "Gallery" },
  { value: "stats", label: "Stats" },
  { value: "sponsors", label: "Sponsors" },
  { value: "rules", label: "Rules" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function TournamentTabs({ tournament }: { tournament: TournamentDetail }) {
  const [active, setActive] = useState<TabValue>("overview");

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as TabValue)} className="mt-6">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className={TRIGGER_CLASS}>
            {tab.label}
            {tab.value === "players" ? ` (${tournament.players})` : ""}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={active} id={active === "rules" ? "rules" : undefined} className="pt-6">
        {active === "overview" && <OverviewTab tournament={tournament} />}
        {active === "players" && <PlayersTab tournament={tournament} />}
        {active === "fixtures" && <FixturesTab tournament={tournament} />}
        {active === "live" && <LiveTab tournament={tournament} />}
        {active === "results" && <ResultsTab tournament={tournament} />}
        {active === "gallery" && <GalleryTab tournament={tournament} />}
        {active === "stats" && <StatsTab tournament={tournament} />}
        {active === "sponsors" && <SponsorsTab tournament={tournament} />}
        {active === "rules" && <RulesTab tournament={tournament} />}
      </TabsContent>
    </Tabs>
  );
}
