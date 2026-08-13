"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radio, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateMatchStatusAction } from "@/app/actions/club-tournament-actions";
import type { MatchStatus } from "@/types/match";

export function MatchStatusControl({
  clubSlug,
  matchId,
  status,
}: {
  clubSlug: string;
  matchId: string;
  status: MatchStatus;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);

  async function setStatus(next: MatchStatus) {
    setIsUpdating(true);
    const result = await updateMatchStatusAction(clubSlug, matchId, next);
    setIsUpdating(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    router.refresh();
  }

  if (status === "scheduled") {
    return (
      <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => setStatus("live")}>
        {isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : <Radio className="size-3.5" />}
        Start Match
      </Button>
    );
  }

  if (status === "live") {
    return (
      <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => setStatus("completed")}>
        {isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
        End Match
      </Button>
    );
  }

  return null;
}
