"use client";

import Image from "next/image";
import { Radio } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { LiveBadge } from "@/components/shared/live-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LIVE_MATCH } from "@/lib/mock/home";
import { HeroCta } from "@/features/home/components/hero-cta";
import { useClub } from "@/components/shared/club-provider";

function LiveMatchCard() {
  const { basePath } = useClub();
  const [p1, p2] = LIVE_MATCH.players;
  return (
    <div className="glass-strong relative w-full max-w-sm rounded-2xl p-5 shadow-[var(--shadow-elevated)] lg:ml-auto">
      <div className="flex items-center justify-between">
        <LiveBadge label="Live Now" />
      </div>

      <p className="mt-3 font-heading text-lg font-bold text-foreground">{LIVE_MATCH.tournament}</p>
      <p className="text-sm text-muted-foreground">{LIVE_MATCH.round}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <AvatarInitials name={p1.name} size="lg" />
          <span className="text-sm font-medium text-foreground">{p1.name}</span>
        </div>

        <div className="flex items-center gap-2 font-tabular text-3xl font-bold">
          <span className="text-primary">{p1.score}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-foreground">{p2.score}</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <AvatarInitials name={p2.name} size="lg" />
          <span className="text-sm font-medium text-foreground">{p2.name}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <span className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground">
          {LIVE_MATCH.table}
        </span>
      </div>

      <LinkButton href={`${basePath}${LIVE_MATCH.href}`} className="mt-4 w-full">
        <Radio className="size-4" /> Watch Live
      </LinkButton>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Image
        src="/images/hero-table.jpg"
        alt="Close-up of a snooker player cueing up on a professional table"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-center">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Welcome To
            </span>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              XYZ Snooker Club
            </h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-primary/90 sm:text-base">
              Where Passion Meets Precision
            </p>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Join the most prestigious snooker club and compete with the best. Play. Compete.
              Win.
            </p>

            <HeroCta />
          </div>

          <LiveMatchCard />
        </div>
      </div>
    </section>
  );
}
