import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function savePushSubscription(
  userId: string,
  subscription: { endpoint: string; p256dh: string; auth: string }
): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
    { onConflict: "endpoint" }
  );
  return { error: error?.message };
}

export async function deletePushSubscriptionByEndpoint(endpoint: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin.from("push_subscriptions").delete().eq("endpoint", endpoint);
}

export async function listAllPushSubscriptions(): Promise<PushSubscriptionRecord[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("push_subscriptions").select("*");
  return (
    data?.map((row) => ({
      id: row.id,
      userId: row.user_id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
    })) ?? []
  );
}

export async function listPushSubscriptionsForUsers(userIds: string[]): Promise<PushSubscriptionRecord[]> {
  if (userIds.length === 0) return [];
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("push_subscriptions").select("*").in("user_id", userIds);
  return (
    data?.map((row) => ({
      id: row.id,
      userId: row.user_id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
    })) ?? []
  );
}

export async function isUserSubscribed(userId: string): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("push_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  return !!data;
}
