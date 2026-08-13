import { CheckCircle2, CircleDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PROFILE_FIELD_LABELS, type PlayerProfile } from "@/types/player-profile";
import { cn } from "@/lib/utils";

export function ProfileCompletionCard({
  percent,
  missing,
  className,
}: {
  percent: number;
  missing: (keyof PlayerProfile)[];
  className?: string;
}) {
  const isComplete = missing.length === 0;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
          {isComplete ? "Profile Complete" : "Complete Your Profile"}
        </h3>
        <span className={cn("font-tabular text-lg font-bold", isComplete ? "text-success" : "text-primary")}>
          {percent}%
        </span>
      </div>
      <Progress value={percent} className="mt-3" />
      {!isComplete ? (
        <div className="mt-4 space-y-1.5">
          <p className="text-xs text-muted-foreground">Missing information:</p>
          <ul className="space-y-1">
            {missing.map((field) => (
              <li key={field} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleDashed className="size-3.5 text-primary" /> {PROFILE_FIELD_LABELS[field]}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="size-4" /> You&apos;re all set to register for tournaments.
        </p>
      )}
    </div>
  );
}
