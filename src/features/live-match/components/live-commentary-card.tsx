import { Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveBadge } from "@/components/shared/live-badge";
import type { LiveMatchView } from "@/features/live-match/types";

export function LiveCommentaryCard({ match }: { match: LiveMatchView }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wide">Live Commentary</CardTitle>
          {match.isLive ? <LiveBadge /> : null}
        </div>
      </CardHeader>
      <CardContent className="max-h-72 space-y-3 overflow-y-auto">
        {match.commentary.map((c, i) => (
          <div key={i} className="flex gap-3 text-sm">
            <span className="flex items-center gap-1 shrink-0 font-tabular text-xs text-muted-foreground">
              <Clock className="size-3" /> {c.time}
            </span>
            <span className="text-muted-foreground">{c.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
