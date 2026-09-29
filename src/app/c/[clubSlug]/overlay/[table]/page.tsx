import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { getTableBoard } from "@/features/table-display/table-board";
import { StreamOverlay } from "@/features/table-display/components/stream-overlay";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ table: string }>;
}): Promise<Metadata> {
  const { table } = await params;
  return { title: `Table ${table} stream overlay` };
}

/** Transparent score overlay for OBS: add as a Browser source (1920×1080) above the camera. */
export default async function TableOverlayPage({
  params,
}: {
  params: Promise<{ clubSlug: string; table: string }>;
}) {
  const { clubSlug, table } = await params;
  const tableNumber = Number(table);
  if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > 99) notFound();

  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer) notFound();

  const initial = await getTableBoard(clubViewer.club, tableNumber);
  return (
    <>
      {/* OBS composites this page over the camera, so nothing behind the overlay may paint. */}
      <style>{"html, body { background: transparent !important; }"}</style>
      <StreamOverlay initial={initial} clubSlug={clubSlug} table={tableNumber} />
    </>
  );
}
