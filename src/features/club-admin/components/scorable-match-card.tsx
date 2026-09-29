import { LiveBadge } from "@/components/shared/live-badge";
import { LinkButton } from "@/components/shared/link-button";
import { MatchStatusControl } from "@/features/club-admin/components/match-status-control";
import type { DrawMatch } from "@/types/match";

/** A match a referee or staff member can score: who's playing, where and when,
 * plus Start/End and Score buttons sized for a phone. */
export function ScorableMatchCard({
  match,
  clubSlug,
  scoreHref,
  context,
}: {
  match: DrawMatch;
  clubSlug: string;
  scoreHref: string | null;
  /** Shown above the players, e.g. "Club League · Round 3". */
  context: string;
}) {
  const isLive = match.status === "live";

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border bg-card p-4 ${isLive ? "border-destructive/60" : "border-border"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-muted-foreground">{context}</p>
        {isLive ? (
          <LiveBadge />
        ) : (
          <span className="shrink-0 rounded-full bg-info-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-info">
            Scheduled
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-heading text-base font-semibold text-foreground">{match.player1Name}</p>
          {isLive ? (
            <span className="font-tabular text-lg font-bold text-primary">{match.framesWonPlayer1}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-heading text-base font-semibold text-foreground">{match.player2Name}</p>
          {isLive ? (
            <span className="font-tabular text-lg font-bold text-muted-foreground">{match.framesWonPlayer2}</span>
          ) : null}
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-card-elevated px-2 py-2">
          <dt className="text-[11px] text-muted-foreground">Table</dt>
          <dd className="text-sm font-bold text-foreground">{match.tableNumber}</dd>
        </div>
        <div className="rounded-xl bg-card-elevated px-2 py-2">
          <dt className="text-[11px] text-muted-foreground">Reporting</dt>
          <dd className="text-sm font-bold text-foreground">{match.reportingTime || "—"}</dd>
        </div>
        <div className="rounded-xl bg-card-elevated px-2 py-2">
          <dt className="text-[11px] text-muted-foreground">{isLive ? "Frame" : "Starts"}</dt>
          <dd className="text-sm font-bold text-foreground">
            {isLive
              ? match.framesWonPlayer1 + match.framesWonPlayer2 + 1
              : match.matchStartTime || "—"}
          </dd>
        </div>
      </dl>

      <div className="grid grid-cols-2 gap-2">
        <MatchStatusControl clubSlug={clubSlug} matchId={match.id} status={match.status} className="h-11 w-full" />
        {scoreHref ? (
          <LinkButton href={scoreHref} className="h-11 w-full">
            Score Match
          </LinkButton>
        ) : null}
      </div>
    </div>
  );
}
