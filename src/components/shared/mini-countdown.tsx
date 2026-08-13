"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

function formatRemaining(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function MiniCountdown({ targetDate, className }: { targetDate: string; className?: string }) {
  const target = new Date(targetDate).getTime();
  const [label, setLabel] = useState(() => formatRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => setLabel(formatRemaining(target)), 30_000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <span className={cn("flex items-center gap-1.5 text-xs font-medium text-primary", className)}>
      <Timer className="size-3.5" /> Closes in {label}
    </span>
  );
}
