"use server";

import { getSession } from "@/lib/auth/session";
import {
  savePushSubscription,
  deletePushSubscriptionByEndpoint,
} from "@/services/push-subscription-service";

export async function savePushSubscriptionAction(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const { error } = await savePushSubscription(session.id, {
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });
  if (error) return { success: false as const, error };
  return { success: true as const };
}

export async function removePushSubscriptionAction(endpoint: string) {
  await deletePushSubscriptionByEndpoint(endpoint);
  return { success: true as const };
}
