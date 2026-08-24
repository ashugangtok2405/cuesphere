"use client";

import * as React from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  savePushSubscriptionAction,
  removePushSubscriptionAction,
} from "@/app/actions/push-subscription-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "unsupported" | "denied" | "subscribed" | "not-subscribed" | "checking";

export function NotificationOptIn() {
  const [status, setStatus] = React.useState<Status>("checking");
  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !VAPID_PUBLIC_KEY) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      if (!cancelled) setStatus(existing ? "subscribed" : "not-subscribed");
    }

    check().catch(() => setStatus("unsupported"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleEnable() {
    if (!VAPID_PUBLIC_KEY) return;
    setIsBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setIsBusy(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const raw = subscription.toJSON();
      const result = await savePushSubscriptionAction({
        endpoint: raw.endpoint!,
        keys: { p256dh: raw.keys!.p256dh, auth: raw.keys!.auth },
      });

      if (!result.success) {
        toast.error(result.error);
        setStatus("not-subscribed");
      } else {
        setStatus("subscribed");
        toast.success("Tournament notifications enabled.");
      }
    } catch {
      toast.error("Couldn't enable notifications on this device.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDisable() {
    setIsBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removePushSubscriptionAction(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("not-subscribed");
      toast.success("Tournament notifications turned off.");
    } catch {
      toast.error("Couldn't turn off notifications.");
    } finally {
      setIsBusy(false);
    }
  }

  if (status === "checking") return null;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {status === "subscribed" ? <BellRing className="size-4" /> : <Bell className="size-4" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Tournament Notifications</p>
            <p className="text-xs text-muted-foreground">
              {status === "unsupported" &&
                "Not supported in this browser. On iPhone, add CueSphere to your Home Screen first, then try again."}
              {status === "denied" &&
                "Notifications are blocked for this site — enable them in your browser settings to turn this on."}
              {status === "subscribed" && "You'll get notified whenever any club creates a new tournament."}
              {status === "not-subscribed" && "Get notified the moment any club creates a new tournament."}
            </p>
          </div>
        </div>

        {status === "subscribed" ? (
          <Button variant="outline" size="sm" disabled={isBusy} onClick={handleDisable}>
            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <BellOff className="size-3.5" />}
            Turn Off
          </Button>
        ) : status === "not-subscribed" ? (
          <Button size="sm" disabled={isBusy} onClick={handleEnable}>
            {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Bell className="size-3.5" />}
            Enable
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
