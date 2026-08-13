"use client";

import * as React from "react";
import type { Club } from "@/types/club";

interface ClubContextValue {
  club: Club;
  basePath: string;
}

const ClubContext = React.createContext<ClubContextValue | null>(null);

export function ClubProvider({ club, children }: { club: Club; children: React.ReactNode }) {
  const value = React.useMemo(() => ({ club, basePath: `/c/${club.slug}` }), [club]);
  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub(): ClubContextValue {
  const ctx = React.useContext(ClubContext);
  if (!ctx) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return ctx;
}
