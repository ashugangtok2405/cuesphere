"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { clubPath } from "@/lib/club-path";
import { deleteClubTournamentAction } from "@/app/actions/club-tournament-actions";

export function DeleteTournamentButton({
  clubSlug,
  tournamentId,
  tournamentName,
}: {
  clubSlug: string;
  tournamentId: string;
  tournamentName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${tournamentName}"? This also removes its registrations and fixtures. This can't be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteClubTournamentAction(clubSlug, tournamentId);
    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Tournament deleted.");
    router.push(clubPath(clubSlug, "/admin/tournaments"));
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" disabled={isDeleting} onClick={handleDelete}>
      {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Delete Tournament
    </Button>
  );
}
