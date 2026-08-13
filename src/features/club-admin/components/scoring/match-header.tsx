import { Table2 } from "lucide-react";
import type { DrawMatch } from "@/types/match";

export function MatchHeader({ match }: { match: DrawMatch }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">{match.round}</span>
      <span>&bull;</span>
      <span className="flex items-center gap-1">
        <Table2 className="size-3.5 text-primary" /> Table {match.tableNumber}
      </span>
    </div>
  );
}
