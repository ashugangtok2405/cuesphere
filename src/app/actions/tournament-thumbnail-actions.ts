"use server";

import { getSession } from "@/lib/auth/session";
import { getClubBySlug, getMembership } from "@/services/club-service";
import { isStaffRole } from "@/types/club";
import {
  getClubTournamentBySlug,
  updateClubTournamentImage,
} from "@/services/club-tournament-service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 3 * 1024 * 1024;

export async function uploadTournamentThumbnailAction(
  clubSlug: string,
  tournamentSlug: string,
  dataUrl: string
) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const club = await getClubBySlug(clubSlug);
  if (!club) return { success: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role)) {
    return { success: false as const, error: "You don't have permission to manage this club." };
  }

  const tournament = await getClubTournamentBySlug(club.id, tournamentSlug);
  if (!tournament) return { success: false as const, error: "Tournament not found." };

  const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) {
    return { success: false as const, error: "Upload a PNG, JPG or WEBP image." };
  }

  const [, mime, ext, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength > MAX_BYTES) {
    return { success: false as const, error: "Thumbnail must be under 3MB." };
  }

  const admin = createSupabaseAdminClient();
  const path = `${club.id}/${tournament.id}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("tournament-thumbnails")
    .upload(path, buffer, { contentType: mime, upsert: true });

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { data } = admin.storage.from("tournament-thumbnails").getPublicUrl(path);
  const imageUrl = `${data.publicUrl}?v=${Date.now()}`;

  await updateClubTournamentImage(tournament.id, imageUrl);
  return { success: true as const, imageUrl };
}
