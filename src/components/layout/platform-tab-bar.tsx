"use client";

import { Compass, Home, LogIn, Trophy, UserRound, Users } from "lucide-react";

import { MobileTabBar, type MobileTab } from "@/components/layout/mobile-tab-bar";
import { useViewer } from "@/components/shared/viewer-provider";

/** Bottom tabs for the platform pages (all clubs, all tournaments, players). */
export function PlatformTabBar() {
  const viewer = useViewer();

  const tabs: MobileTab[] = [
    { href: "/", label: "Home", icon: Home, exact: true },
    { href: "/clubs", label: "Clubs", icon: Compass },
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/players", label: "Players", icon: Users },
  ];

  if (!viewer.user) {
    tabs.push({ href: "/login", label: "Log in", icon: LogIn });
  } else if (viewer.profile) {
    tabs.push({ href: `/players/${viewer.profile.id}`, label: "Me", icon: UserRound });
  } else {
    tabs.push({ href: "/account/profile", label: "Me", icon: UserRound });
  }

  return <MobileTabBar tabs={tabs} />;
}
