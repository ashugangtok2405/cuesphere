"use client";

import { Image as ImageIcon, LayoutDashboard, Radio, Settings, Trophy } from "lucide-react";

import { MobileTabBar, type MobileTab } from "@/components/layout/mobile-tab-bar";

/** Bottom tabs for the club admin panel on phones (replaces the sidebar there). */
export function AdminTabBar({ basePath, scorekeeperOnly }: { basePath: string; scorekeeperOnly: boolean }) {
  const tabs: MobileTab[] = scorekeeperOnly
    ? [{ href: `${basePath}/live`, label: "Live Scoring", icon: Radio }]
    : [
        { href: basePath, label: "Overview", icon: LayoutDashboard, exact: true },
        { href: `${basePath}/tournaments`, label: "Tournaments", icon: Trophy },
        { href: `${basePath}/live`, label: "Live", icon: Radio },
        { href: `${basePath}/gallery`, label: "Gallery", icon: ImageIcon },
        { href: `${basePath}/settings`, label: "Settings", icon: Settings },
      ];

  return <MobileTabBar tabs={tabs} label="Admin" />;
}
