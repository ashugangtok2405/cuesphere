"use client";

import * as React from "react";

/** Registers the service worker for every visitor, not just those who opt in
 * to push, so the site can be installed to the home screen as an app. */
export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);

  return null;
}
