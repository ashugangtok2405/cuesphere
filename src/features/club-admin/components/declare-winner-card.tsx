"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClubTournamentAction } from "@/app/actions/club-tournament-actions";
import type { ClubTournament } from "@/types/club-tournament";

const NONE = "__none__";

export function DeclareWinnerCard({
  clubSlug,
  tournament,
  players,
}: {
  clubSlug: string;
  tournament: ClubTournament;
  players: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [championId, setChampionId] = React.useState(tournament.championId ?? NONE);
  const [runnerUpId, setRunnerUpId] = React.useState(tournament.runnerUpId ?? NONE);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    if (championId === NONE) {
      toast.error("Select a winner.");
      return;
    }

    setIsSaving(true);
    const result = await updateClubTournamentAction(clubSlug, tournament.id, {
      championId,
      runnerUpId: runnerUpId === NONE ? null : runnerUpId,
      status: "completed",
    });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Winner declared — tournament marked completed.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wide">
          <Crown className="size-4 text-primary" /> Declare Winner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Sets this tournament to Completed and shows the winner in Hall of Fame.
        </p>
        <div className="space-y-2">
          <Label>Winner</Label>
          <Select value={championId} onValueChange={(v) => v && setChampionId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Select a player</SelectItem>
              {players.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Runner-up (Optional)</Label>
          <Select value={runnerUpId} onValueChange={(v) => v && setRunnerUpId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {players
                .filter((p) => p.id !== championId)
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" disabled={isSaving} onClick={handleSave}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Crown className="size-4" />}
          Save Result
        </Button>
      </CardContent>
    </Card>
  );
}
