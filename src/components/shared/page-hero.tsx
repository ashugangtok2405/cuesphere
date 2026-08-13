"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClub } from "@/components/shared/club-provider";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export function PageHero({ title, description, breadcrumbs, className }: PageHeroProps) {
  const { basePath } = useClub();

  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
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

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-4xl font-bold uppercase leading-none tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>

        <nav className="mt-4 flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="size-3.5 text-muted-foreground" /> : null}
              {crumb.href ? (
                <Link
                  href={`${basePath}${crumb.href === "/" ? "" : crumb.href}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {description ? (
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
