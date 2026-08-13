"use client";

import * as React from "react";
import type { ClubViewer } from "@/lib/auth/get-club-viewer";

const ClubViewerContext = React.createContext<ClubViewer | null>(null);

export function ClubViewerProvider({
  viewer,
  children,
}: {
  viewer: ClubViewer;
  children: React.ReactNode;
}) {
  return <ClubViewerContext.Provider value={viewer}>{children}</ClubViewerContext.Provider>;
}

export function useClubViewer(): ClubViewer {
  const ctx = React.useContext(ClubViewerContext);
  if (!ctx) {
    throw new Error("useClubViewer must be used within a ClubViewerProvider");
  }
  return ctx;
}
