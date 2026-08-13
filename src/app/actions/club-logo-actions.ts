"use server";

import { getSession } from "@/lib/auth/session";
import { getClubBySlug, getMembership, updateClub } from "@/services/club-service";
import { isStaffRole } from "@/types/club";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const ALLOWED_LOGO_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 2 * 1024 * 1024;

export async function uploadClubLogoAction(clubSlug: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const club = await getClubBySlug(clubSlug);
  if (!club) return { success: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role)) {
    return { success: false as const, error: "You don't have permission to manage this club." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false as const, error: "No file provided." };
  }

  const ext = ALLOWED_LOGO_TYPES[file.type];
  if (!ext) {
    return { success: false as const, error: "Upload a PNG, JPG, WEBP or SVG image." };
  }
  if (file.size > MAX_BYTES) {
    return { success: false as const, error: "Logo must be under 2MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createSupabaseAdminClient();
  const path = `${club.id}/logo.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("club-logos")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { data } = admin.storage.from("club-logos").getPublicUrl(path);
  const logoUrl = `${data.publicUrl}?v=${Date.now()}`;

  await updateClub(club.id, { logoUrl });
  return { success: true as const, logoUrl };
}

const ALLOWED_COVER_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
};

const MAX_COVER_BYTES = 5 * 1024 * 1024;

export async function uploadClubCoverAction(clubSlug: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const club = await getClubBySlug(clubSlug);
  if (!club) return { success: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role)) {
    return { success: false as const, error: "You don't have permission to manage this club." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false as const, error: "No file provided." };
  }

  const ext = ALLOWED_COVER_TYPES[file.type];
  if (!ext) {
    return { success: false as const, error: "Upload a PNG, JPG or WEBP image." };
  }
  if (file.size > MAX_COVER_BYTES) {
    return { success: false as const, error: "Cover image must be under 5MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createSupabaseAdminClient();
  const path = `${club.id}/cover.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("club-covers")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { data } = admin.storage.from("club-covers").getPublicUrl(path);
  const heroBannerUrl = `${data.publicUrl}?v=${Date.now()}`;

  await updateClub(club.id, { heroBannerUrl });
  return { success: true as const, heroBannerUrl };
}
