import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { GalleryImage } from "@/types/gallery";

interface GalleryImageRow {
  id: string;
  club_id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

function fromRow(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    clubId: row.club_id,
    imageUrl: row.image_url,
    caption: row.caption,
    createdAt: row.created_at,
  };
}

export async function listGalleryImages(clubId: string): Promise<GalleryImage[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("club_gallery_images")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });
  return (data as GalleryImageRow[] | null)?.map(fromRow) ?? [];
}

export async function addGalleryImage(
  clubId: string,
  imageUrl: string,
  caption: string
): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("club_gallery_images").insert({
    club_id: clubId,
    image_url: imageUrl,
    caption,
  });
  return { error: error?.message };
}

export async function deleteGalleryImage(imageId: string, clubId: string): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("club_gallery_images")
    .delete()
    .eq("id", imageId)
    .eq("club_id", clubId);
  return { error: error?.message };
}
