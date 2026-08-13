import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Notification } from "@/types/notification";

interface NotificationRow {
  id: string;
  user_id: string;
  club_id: string;
  channel: Notification["channel"];
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

function fromRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    clubId: row.club_id,
    channel: row.channel,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function createNotification(
  clubId: string,
  userId: string,
  title: string,
  message: string
): Promise<void> {
  const admin = createSupabaseAdminClient();
  const base = { user_id: userId, club_id: clubId, title, message, read: false, created_at: new Date().toISOString() };
  await admin.from("notifications").insert([
    { ...base, channel: "website" },
    { ...base, channel: "email" },
  ]);

  // Mock email delivery — in production this would call a real email provider (e.g. Resend/SendGrid).
  console.log(`[mock-email] To user ${userId} (club ${clubId}): ${title} — ${message}`);
}

export async function listForUser(userId: string, clubId: string): Promise<Notification[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("club_id", clubId)
    .eq("channel", "website")
    .order("created_at", { ascending: false });
  return (data as NotificationRow[] | null)?.map(fromRow) ?? [];
}

export async function markAllRead(userId: string, clubId: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin.from("notifications").update({ read: true }).eq("user_id", userId).eq("club_id", clubId);
}

export async function getUnreadCount(userId: string, clubId: string): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("club_id", clubId)
    .eq("channel", "website")
    .eq("read", false);
  return count ?? 0;
}
