"use client";

import * as React from "react";
import { ArrowRight, Trophy, Target, MapPin, Calendar, Wallet } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { useClub } from "@/components/shared/club-provider";
import { CURRENT_CHAMPION, HIGHEST_BREAK, UPCOMING_TOURNAMENT } from "@/lib/mock/home";

function CardShell({
  eyebrow,
  visual,
  children,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  visual: React.ReactNode;
  children: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex h-28 items-center justify-center felt-texture">
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
        {visual}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-1.5">{children}</div>
        <LinkButton href={ctaHref} variant="outline" size="sm" className="w-full justify-between">
          {ctaLabel} <ArrowRight className="size-3.5" />
        </LinkButton>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" /> {children}
    </p>
  );
}

export function HighlightsGrid() {
  const { basePath } = useClub();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CardShell
          eyebrow="Upcoming Tournament"
          visual={<Trophy className="size-10 text-primary drop-shadow-[0_0_16px_rgba(212,175,55,0.5)]" />}
          ctaLabel="Register Now"
          ctaHref={`${basePath}${UPCOMING_TOURNAMENT.href}`}
        >
          <p className="font-heading text-lg font-bold text-foreground">
            {UPCOMING_TOURNAMENT.name}
          </p>
          <MetaRow icon={Calendar}>{UPCOMING_TOURNAMENT.dateRange}</MetaRow>
          <MetaRow icon={MapPin}>{UPCOMING_TOURNAMENT.location}</MetaRow>
          <MetaRow icon={Wallet}>Prize Pool {UPCOMING_TOURNAMENT.prizePool}</MetaRow>
        </CardShell>

        <CardShell
          eyebrow="Current Champion"
          visual={<AvatarInitials name={CURRENT_CHAMPION.name} size="xl" />}
          ctaLabel="View Tournament"
          ctaHref={`${basePath}${CURRENT_CHAMPION.href}`}
        >
          <p className="font-heading text-lg font-bold text-foreground">{CURRENT_CHAMPION.name}</p>
          <p className="text-xs text-muted-foreground">{CURRENT_CHAMPION.tournament}</p>
        </CardShell>

        <CardShell
          eyebrow="Highest Break"
          visual={<Target className="size-10 text-primary drop-shadow-[0_0_16px_rgba(212,175,55,0.5)]" />}
          ctaLabel="View Details"
          ctaHref={`${basePath}${HIGHEST_BREAK.href}`}
        >
          <p className="font-tabular text-3xl font-bold text-primary">{HIGHEST_BREAK.value}</p>
          <p className="text-xs text-muted-foreground">By {HIGHEST_BREAK.by}</p>
          <p className="text-xs text-muted-foreground">{HIGHEST_BREAK.tournament}</p>
        </CardShell>
      </div>
    </section>
  );
}
