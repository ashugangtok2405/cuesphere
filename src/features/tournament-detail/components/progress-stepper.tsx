import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProgressStage } from "@/types/tournament-detail";

export function ProgressStepper({ stages }: { stages: ProgressStage[] }) {
  return (
    <div className="flex items-center">
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-bold",
                stage.status === "completed" && "border-success bg-success/15 text-success",
                stage.status === "current" && "border-primary bg-primary text-primary-foreground",
                stage.status === "upcoming" && "border-border bg-card text-muted-foreground"
              )}
            >
              {stage.status === "completed" ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wide",
                stage.status === "current" ? "text-primary" : "text-muted-foreground"
              )}
            >
              {stage.label}
            </span>
          </div>
          {i < stages.length - 1 ? (
            <span
              className={cn("mx-2 h-px flex-1", stage.status === "completed" ? "bg-success" : "bg-border")}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
