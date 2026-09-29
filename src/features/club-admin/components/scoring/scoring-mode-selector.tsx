"use client";

import { CheckCircle2, ClipboardList, ListChecks, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScoringMode = "result" | "frames" | "live";

const MODES: { value: ScoringMode; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "result",
    label: "Result Only",
    description: "Enter only the final winner and score at the end of the match.",
    icon: ClipboardList,
  },
  {
    value: "frames",
    label: "Frame-by-Frame",
    description: "Record each frame score and winner.",
    icon: ListChecks,
  },
  {
    value: "live",
    label: "Live Score",
    description: "Update every ball in real time with a live scoreboard.",
    icon: Radio,
  },
];

export function ScoringModeSelector({
  mode,
  onChange,
  disabled,
}: {
  mode: ScoringMode;
  onChange: (mode: ScoringMode) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      {/* Phones: a compact segmented switch. Larger screens: descriptive cards. */}
      <div
        role="radiogroup"
        aria-label="Scoring mode"
        className="flex gap-1 rounded-2xl border border-border bg-card p-1 sm:hidden"
      >
        {MODES.map((m) => {
          const isActive = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(m.value)}
              className={cn(
                "h-10 flex-1 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-60",
                isActive
                  ? "bg-felt font-bold text-white ring-1 ring-inset ring-success/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <div className="mb-3 hidden items-center justify-between sm:flex">
        <div>
          <p className="text-sm font-semibold text-foreground">Scoring Mode</p>
          <p className="text-xs text-muted-foreground">Choose how you want to update match scores.</p>
        </div>
      </div>
      <div className="hidden gap-3 sm:grid sm:grid-cols-3">
        {MODES.map((m) => {
          const isActive = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(m.value)}
              className={cn(
                "relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-border-strong"
              )}
            >
              {isActive ? (
                <CheckCircle2 className="absolute right-3 top-3 size-4 text-primary" />
              ) : null}
              <m.icon className="size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </button>
          );
        })}
      </div>
      {disabled ? (
        <p className="mt-2 text-xs text-muted-foreground">
          This match is completed — scoring mode can&apos;t be changed anymore.
        </p>
      ) : null}
    </div>
  );
}
