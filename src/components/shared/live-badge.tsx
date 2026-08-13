import { cn } from "@/lib/utils";

export function LiveBadge({
  className,
  label = "LIVE",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-bold tracking-wider text-destructive uppercase",
        className
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-pulse-live rounded-full bg-destructive" />
        <span className="relative inline-flex size-1.5 rounded-full bg-destructive" />
      </span>
      {label}
    </span>
  );
}
