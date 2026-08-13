import { cn } from "@/lib/utils";
import { LiveBadge } from "@/components/shared/live-badge";

export type MatchStatus =
  | "live"
  | "upcoming"
  | "completed"
  | "registration-open"
  | "coming-soon"
  | "cancelled";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  live: { label: "Live", className: "" },
  upcoming: { label: "Upcoming", className: "bg-info/15 text-info" },
  completed: { label: "Completed", className: "bg-white/10 text-muted-foreground" },
  "registration-open": { label: "Registration Open", className: "bg-success/15 text-success" },
  "coming-soon": { label: "Coming Soon", className: "bg-primary/15 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
};

export function StatusBadge({ status, className }: { status: MatchStatus; className?: string }) {
  if (status === "live") return <LiveBadge className={className} />;
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
