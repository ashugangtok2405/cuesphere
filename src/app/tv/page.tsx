import type { Metadata } from "next";

import { TvPairing } from "@/features/table-display/components/tv-pairing";

export const metadata: Metadata = { title: "TV" };

/** Open cuesphere.app/tv on any table TV and pair it from the admin panel. */
export default function TvPage() {
  return <TvPairing />;
}
