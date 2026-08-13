"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** Periodically re-fetches this route's server data so the live match page
 * reflects the admin's scoring updates without the viewer manually reloading. */
export function LiveAutoRefresh({ intervalMs = 4000 }: { intervalMs?: number }) {
  const router = useRouter();

  React.useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
