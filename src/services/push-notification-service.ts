import webpush from "web-push";
import {
  listAllPushSubscriptions,
  deletePushSubscriptionByEndpoint,
} from "@/services/push-subscription-service";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:support@cuesphere.app";
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

interface NotificationPayload {
  title: string;
  body: string;
  url: string;
}

/** Broadcasts to every registered user's subscribed devices, regardless of
 * club membership — used for "a new tournament was created somewhere" so
 * nobody misses one. Expired/invalid subscriptions are cleaned up as they're
 * discovered rather than left to accumulate. */
export async function broadcastPushNotification(payload: NotificationPayload): Promise<void> {
  ensureConfigured();
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;

  const subscriptions = await listAllPushSubscriptions();
  if (subscriptions.length === 0) return;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscriptionByEndpoint(sub.endpoint);
        }
      }
    })
  );
}

export async function notifyNewTournament(clubName: string, clubSlug: string, tournamentName: string, tournamentSlug: string) {
  await broadcastPushNotification({
    title: `New tournament: ${tournamentName}`,
    body: `${clubName} just announced "${tournamentName}". Tap to see details and register.`,
    url: `/c/${clubSlug}/tournaments/${tournamentSlug}`,
  });
}
