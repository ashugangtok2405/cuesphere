import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { listGalleryImages } from "@/services/gallery-service";
import { GalleryManager } from "@/features/club-admin/components/gallery-manager";
import { clubPath } from "@/lib/club-path";
import { isScorekeeperOnly } from "@/types/club";

export const metadata: Metadata = { title: "Gallery" };

export default async function ClubAdminGalleryPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer) return null;
  if (isScorekeeperOnly(clubViewer.membership?.role)) {
    redirect(clubPath(clubSlug, "/admin/live"));
  }

  const images = await listGalleryImages(clubViewer.club.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Gallery</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Photos shown on {clubViewer.club.name}&apos;s public gallery page.
      </p>

      <div className="mt-8">
        <GalleryManager clubSlug={clubSlug} images={images} />
      </div>
    </div>
  );
}
