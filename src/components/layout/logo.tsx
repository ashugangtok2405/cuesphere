"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useClub } from "@/components/shared/club-provider";

export function Logo({ className }: { className?: string }) {
  const { club, basePath } = useClub();
  const [firstWord, ...rest] = club.name.split(" ");

  return (
    <Link href={basePath} className={cn("group flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/40 transition-colors group-hover:border-primary",
          club.logoUrl ? "bg-white" : "bg-primary/10"
        )}
      >
        {club.logoUrl ? (
          <Image src={club.logoUrl} alt={club.name} fill sizes="36px" className="object-contain p-0.5" />
        ) : (
          <svg viewBox="0 0 24 24" className="size-5 text-primary" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3.2" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-base font-bold tracking-tight text-foreground">
          {firstWord} <span className="text-primary">{rest.join(" ")}</span>
        </span>
        {club.tagline ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {club.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
