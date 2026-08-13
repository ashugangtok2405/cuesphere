"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function LiveClock({
  mode,
  referenceMs,
  className,
}: {
  mode: "up" | "down";
  referenceMs: number;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diffMs = mode === "up" ? now - referenceMs : referenceMs - now;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const label =
    mode === "up" ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;

  return <span className={cn("font-tabular", className)}>{label}</span>;
}
