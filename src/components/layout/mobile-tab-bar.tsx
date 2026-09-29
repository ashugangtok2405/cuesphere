"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MobileTab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only highlight on an exact path match (for "home" style tabs). */
  exact?: boolean;
}

/** App-style bottom navigation shown below the md breakpoint. Pages get
 * matching bottom padding from the `.mobile-tab-bar` rule in globals.css. */
export function MobileTabBar({ tabs, label = "Main" }: { tabs: MobileTab[]; label?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="mobile-tab-bar fixed inset-x-0 bottom-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-[22px]" strokeWidth={active ? 2.25 : 2} />
              <span className="max-w-full truncate px-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
