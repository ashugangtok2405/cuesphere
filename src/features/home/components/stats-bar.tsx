import { Trophy, Users, Target, Star, Wallet, CalendarCheck } from "lucide-react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { CLUB_STATS } from "@/lib/mock/home";

const icons = {
  tournaments: Trophy,
  players: Users,
  matches: Target,
  highestBreak: Star,
  prizeMoney: Wallet,
  ongoing: CalendarCheck,
};

export function StatsBar() {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-border">
          {CLUB_STATS.map((stat) => {
            const Icon = icons[stat.key as keyof typeof icons];
            return (
              <div key={stat.key} className="flex items-center gap-3 lg:pl-6 lg:first:pl-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-tabular text-xl font-bold text-foreground sm:text-2xl">
                    <AnimatedCounter
                      value={stat.value}
                      prefix={"prefix" in stat ? stat.prefix : undefined}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
