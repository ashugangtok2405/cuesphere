import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeStreamSettings, type StreamSettings } from "@/types/stream";

/** Stream settings for a club; defaults if none are saved (or migration 0023 isn't applied yet). */
export async function getStreamSettings(clubId: string): Promise<StreamSettings> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("club_stream_settings").select("settings").eq("club_id", clubId).maybeSingle();
  return normalizeStreamSettings(data?.settings);
}

export async function saveStreamSettings(clubId: string, settings: StreamSettings): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("club_stream_settings")
    .upsert({ club_id: clubId, settings, updated_at: new Date().toISOString() });
  return { error: error?.message };
}
