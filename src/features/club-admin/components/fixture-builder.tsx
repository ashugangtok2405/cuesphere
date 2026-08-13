"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Shuffle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { cn } from "@/lib/utils";
import { saveFixturesAction } from "@/app/actions/club-tournament-actions";
import type { DrawMatch } from "@/types/match";

interface Player {
  id: string;
  name: string;
  photoUrl?: string | null;
}

interface Slot {
  tableNumber: number;
  player1Id: string | null;
  player2Id: string | null;
}

const ROUND_SUGGESTIONS = [
  "Round 1",
  "Round 2",
  "Round 3",
  "Round 4",
  "Quarter Finals",
  "Semi Finals",
  "Finals",
];

function slotsForRound(round: string, matches: DrawMatch[]): Slot[] {
  return matches
    .filter((m) => m.round === round)
    .map((m) => ({ tableNumber: m.tableNumber, player1Id: m.player1Id, player2Id: m.player2Id }))
    .sort((a, b) => a.tableNumber - b.tableNumber);
}

function winnersOfRound(round: string, matches: DrawMatch[], photoByPlayerId: Map<string, string | null | undefined>): Player[] {
  return matches
    .filter((m) => m.round === round && m.status === "completed" && m.winnerId)
    .map((m) => {
      const isPlayer1 = m.winnerId === m.player1Id;
      const id = m.winnerId as string;
      const name = isPlayer1 ? m.player1Name : m.player2Name;
      return { id, name, photoUrl: photoByPlayerId.get(id) };
    });
}

function PlayerChip({
  player,
  draggable = true,
  onRemove,
}: {
  player: Player;
  draggable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", player.id)}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground shadow-sm active:cursor-grabbing"
      style={{ cursor: draggable ? "grab" : "default" }}
    >
      <AvatarInitials name={player.name} photoUrl={player.photoUrl} size="sm" className="size-5 text-[9px]" />
      {player.name}
      {onRemove ? (
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function DropZone({
  player,
  onDrop,
  onRemove,
}: {
  player: Player | undefined;
  onDrop: (playerId: string) => void;
  onRemove: () => void;
}) {
  const [isOver, setIsOver] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const playerId = e.dataTransfer.getData("text/plain");
        if (playerId) onDrop(playerId);
      }}
      className={cn(
        "flex h-10 min-w-[10rem] items-center rounded-lg border-2 border-dashed px-2 transition-colors",
        isOver ? "border-primary bg-primary/10" : "border-border bg-background/40",
        player ? "border-solid border-border bg-card" : ""
      )}
    >
      {player ? (
        <PlayerChip player={player} draggable onRemove={onRemove} />
      ) : (
        <span className="px-1 text-xs text-muted-foreground">Drop player here</span>
      )}
    </div>
  );
}

export function FixtureBuilder({
  clubSlug,
  tournamentId,
  players,
  matches,
}: {
  clubSlug: string;
  tournamentId: string;
  players: Player[];
  matches: DrawMatch[];
}) {
  const router = useRouter();

  // Rounds in the order they were first created (matches are pre-sorted by created_at).
  const existingRounds = React.useMemo(() => {
    const seen: string[] = [];
    for (const m of matches) {
      if (!seen.includes(m.round)) seen.push(m.round);
    }
    return seen;
  }, [matches]);

  const [pendingNewRounds, setPendingNewRounds] = React.useState<string[]>([]);
  const [newRoundName, setNewRoundName] = React.useState("");
  const allRounds = [...existingRounds, ...pendingNewRounds.filter((r) => !existingRounds.includes(r))];

  const [selectedRound, setSelectedRound] = React.useState<string>(
    () => allRounds[allRounds.length - 1] ?? "Round 1"
  );

  const photoByPlayerId = React.useMemo(
    () => new Map(players.map((p) => [p.id, p.photoUrl])),
    [players]
  );

  // The player pool for a round is either every registered player (first
  // round) or only the winners of the round immediately before it.
  const poolPlayers: Player[] = React.useMemo(() => {
    const idx = existingRounds.indexOf(selectedRound);
    const priorRound =
      idx > 0
        ? existingRounds[idx - 1]
        : idx === -1
          ? existingRounds[existingRounds.length - 1]
          : undefined;

    if (!priorRound) return players;
    return winnersOfRound(priorRound, matches, photoByPlayerId);
  }, [selectedRound, existingRounds, matches, players, photoByPlayerId]);

  const [slots, setSlots] = React.useState<Slot[]>(() => {
    const initial = slotsForRound(selectedRound, matches);
    if (initial.length > 0) return initial;
    const tableCount = Math.max(1, Math.ceil(poolPlayers.length / 2));
    return Array.from({ length: tableCount }, (_, i) => ({ tableNumber: i + 1, player1Id: null, player2Id: null }));
  });
  const [isSaving, setIsSaving] = React.useState(false);

  function switchRound(round: string) {
    setSelectedRound(round);
    const existing = slotsForRound(round, matches);
    if (existing.length > 0) {
      setSlots(existing);
    } else {
      const idx = existingRounds.indexOf(round);
      const priorRound =
        idx > 0 ? existingRounds[idx - 1] : idx === -1 ? existingRounds[existingRounds.length - 1] : undefined;
      const pool = priorRound ? winnersOfRound(priorRound, matches, photoByPlayerId) : players;
      const tableCount = Math.max(1, Math.ceil(pool.length / 2));
      setSlots(Array.from({ length: tableCount }, (_, i) => ({ tableNumber: i + 1, player1Id: null, player2Id: null })));
    }
  }

  function addRound() {
    const name = newRoundName.trim();
    if (!name) {
      toast.error("Enter a round name.");
      return;
    }
    if (allRounds.includes(name)) {
      toast.error("That round already exists.");
      return;
    }
    setPendingNewRounds((prev) => [...prev, name]);
    setNewRoundName("");
    switchRound(name);
  }

  const playerById = React.useMemo(() => new Map(poolPlayers.map((p) => [p.id, p])), [poolPlayers]);
  const assignedIds = React.useMemo(
    () => new Set(slots.flatMap((s) => [s.player1Id, s.player2Id]).filter((id): id is string => !!id)),
    [slots]
  );
  const pool = poolPlayers.filter((p) => !assignedIds.has(p.id));

  function assign(tableNumber: number, position: "player1Id" | "player2Id", playerId: string) {
    setSlots((prev) =>
      prev.map((slot) => {
        const cleared = {
          player1Id: slot.player1Id === playerId ? null : slot.player1Id,
          player2Id: slot.player2Id === playerId ? null : slot.player2Id,
        };
        if (slot.tableNumber === tableNumber) {
          return { ...slot, ...cleared, [position]: playerId };
        }
        return { ...slot, ...cleared };
      })
    );
  }

  function clearSlot(tableNumber: number, position: "player1Id" | "player2Id") {
    setSlots((prev) =>
      prev.map((slot) => (slot.tableNumber === tableNumber ? { ...slot, [position]: null } : slot))
    );
  }

  function addTable() {
    setSlots((prev) => [...prev, { tableNumber: prev.length + 1, player1Id: null, player2Id: null }]);
  }

  function removeTable() {
    setSlots((prev) => prev.slice(0, -1));
  }

  function autoFill() {
    const unassigned = [...pool];
    setSlots((prev) =>
      prev.map((slot) => {
        let { player1Id, player2Id } = slot;
        if (!player1Id && unassigned.length > 0) player1Id = unassigned.shift()!.id;
        if (!player2Id && unassigned.length > 0) player2Id = unassigned.shift()!.id;
        return { ...slot, player1Id, player2Id };
      })
    );
  }

  function clearAll() {
    setSlots((prev) => prev.map((slot) => ({ ...slot, player1Id: null, player2Id: null })));
  }

  async function handleSave() {
    const pairs = slots
      .filter((s) => s.player1Id && s.player2Id)
      .map((s) => ({ tableNumber: s.tableNumber, player1Id: s.player1Id!, player2Id: s.player2Id! }));

    setIsSaving(true);
    const result = await saveFixturesAction(clubSlug, tournamentId, selectedRound, pairs);
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`Saved ${pairs.length} fixture${pairs.length === 1 ? "" : "s"} for ${selectedRound}.`);
    setPendingNewRounds((prev) => prev.filter((r) => r !== selectedRound));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Round</p>
        <div className="flex flex-wrap items-center gap-2">
          {allRounds.map((round) => (
            <button
              key={round}
              type="button"
              onClick={() => switchRound(round)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                round === selectedRound
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {round}
            </button>
          ))}
          <Input
            value={newRoundName}
            onChange={(e) => setNewRoundName(e.target.value)}
            placeholder="e.g. Semi Finals"
            list="round-suggestions"
            className="h-8 w-40"
          />
          <datalist id="round-suggestions">
            {ROUND_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <Button type="button" variant="outline" size="sm" onClick={addRound}>
            <Plus className="size-3.5" /> Add Round
          </Button>
        </div>
        {existingRounds.indexOf(selectedRound) > 0 || (existingRounds.length > 0 && !existingRounds.includes(selectedRound)) ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Player pool is the winners advancing from the previous round only.
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Available Players ({pool.length})
        </p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const playerId = e.dataTransfer.getData("text/plain");
            if (!playerId) return;
            setSlots((prev) =>
              prev.map((slot) => ({
                ...slot,
                player1Id: slot.player1Id === playerId ? null : slot.player1Id,
                player2Id: slot.player2Id === playerId ? null : slot.player2Id,
              }))
            );
          }}
          className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-dashed border-border bg-background/40 p-3"
        >
          {poolPlayers.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              No players have qualified for this round yet — complete the previous round first.
            </span>
          ) : pool.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              All players assigned. Drag a player here to unassign.
            </span>
          ) : (
            pool.map((p) => <PlayerChip key={p.id} player={p} />)
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addTable}>
          <Plus className="size-3.5" /> Add Table
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={removeTable} disabled={slots.length <= 1}>
          Remove Table
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={autoFill} disabled={pool.length === 0}>
          <Shuffle className="size-3.5" /> Auto-Fill Remaining
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
          <Trash2 className="size-3.5" /> Clear All
        </Button>
      </div>

      <div className="space-y-2">
        {slots.map((slot) => (
          <div key={slot.tableNumber} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span className="w-20 shrink-0 text-xs font-semibold text-muted-foreground">
              Table {slot.tableNumber}
            </span>
            <DropZone
              player={slot.player1Id ? playerById.get(slot.player1Id) : undefined}
              onDrop={(id) => assign(slot.tableNumber, "player1Id", id)}
              onRemove={() => clearSlot(slot.tableNumber, "player1Id")}
            />
            <span className="text-xs text-muted-foreground">vs</span>
            <DropZone
              player={slot.player2Id ? playerById.get(slot.player2Id) : undefined}
              onDrop={(id) => assign(slot.tableNumber, "player2Id", id)}
              onRemove={() => clearSlot(slot.tableNumber, "player2Id")}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Confirm Fixtures for {selectedRound}
      </Button>
    </div>
  );
}
