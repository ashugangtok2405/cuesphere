"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = true,
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  const formatted = separator
    ? display.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })
    : display.toFixed(decimals);

  return (
    <span ref={ref} className={cn("font-tabular", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
