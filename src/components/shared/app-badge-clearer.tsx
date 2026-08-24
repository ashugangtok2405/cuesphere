"use client";

import * as React from "react";

/** Clears the home-screen app icon badge (and any lingering system
 * notifications) whenever the installed PWA is opened or brought to the
 * foreground — mirrors how native apps clear their unread badge on open. */
export function AppBadgeClearer() {
  React.useEffect(() => {
    function clear() {
      if (document.visibilityState !== "visible") return;
      if ("clearAppBadge" in navigator) {
        (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge().catch(() => {});
      }
      navigator.serviceWorker?.controller?.postMessage("clear-badge");
    }

    clear();
    document.addEventListener("visibilitychange", clear);
    window.addEventListener("focus", clear);
    return () => {
      document.removeEventListener("visibilitychange", clear);
      window.removeEventListener("focus", clear);
    };
  }, []);

  return null;
}
