import { cn } from "@/lib/utils";
import { SPONSORS } from "@/lib/constants";

export function SponsorsStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-10 gap-y-4", className)}>
      {SPONSORS.map((sponsor) => (
        <span
          key={sponsor.name}
          className="font-heading text-sm font-semibold tracking-wide text-muted-foreground/70 transition-colors hover:text-foreground sm:text-base"
        >
          {sponsor.name}
        </span>
      ))}
    </div>
  );
}
