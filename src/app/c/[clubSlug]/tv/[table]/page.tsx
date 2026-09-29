import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { getTableBoard } from "@/features/table-display/table-board";
import { TvScoreboard } from "@/features/table-display/components/tv-scoreboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ table: string }>;
}): Promise<Metadata> {
  const { table } = await params;
  return { title: `Table ${table} scoreboard` };
}

/** Open this on the TV beside a table: it shows that table's score, hands-free. */
export default async function TableTvPage({
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
  return <TvScoreboard initial={initial} clubSlug={clubSlug} table={tableNumber} />;
}
