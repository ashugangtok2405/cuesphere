"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownTimer({
  targetDate,
  label = "Tournament Ends In",
  className,
}: {
  targetDate: string;
  label?: string;
  className?: string;
}) {
  const target = new Date(targetDate).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { value: remaining.days, label: "Days" },
    { value: remaining.hours, label: "Hrs" },
    { value: remaining.minutes, label: "Mins" },
    { value: remaining.seconds, label: "Secs" },
  ];

  return (
    <div className={cn("glass-strong rounded-2xl px-5 py-4", className)}>
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="font-tabular text-3xl font-bold text-foreground">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 ? <span className="text-xl text-border-strong">:</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
