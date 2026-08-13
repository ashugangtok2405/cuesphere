import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarClock } from "lucide-react";
import type { LiveMatchView } from "@/features/live-match/types";

export function NextMatchCard({ match }: { match: LiveMatchView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">
          Next Match on {match.tableLabel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {match.nextMatch ? (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {match.nextMatch.date}, {match.nextMatch.time}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <AvatarInitials name="TBD" size="md" />
                <span className="text-xs font-medium text-muted-foreground">TBD</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">VS</span>
              <div className="flex flex-col items-center gap-2">
                <AvatarInitials name="TBD" size="md" />
                <span className="text-xs font-medium text-muted-foreground">TBD</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<CalendarClock className="size-6" />}
            title="No match scheduled"
            description="The next fixture for this table hasn't been set yet."
          />
        )}
      </CardContent>
    </Card>
  );
}
