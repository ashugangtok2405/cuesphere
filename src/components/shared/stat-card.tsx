import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/shared/animated-counter";

type StatAccent = "gold" | "success" | "danger" | "info" | "neutral";

const accentStyles: Record<StatAccent, string> = {
  gold: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  neutral: "bg-white/5 text-foreground",
};

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  accent?: StatAccent;
  trend?: { value: number; positive?: boolean };
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  prefix,
  suffix,
  decimals,
  accent = "gold",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "card-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accentStyles[accent]
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground font-heading">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          {trend ? (
            <span
              className={cn(
                "text-xs font-semibold",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}%
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
