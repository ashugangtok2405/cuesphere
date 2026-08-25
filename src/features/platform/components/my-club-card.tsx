"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClubCard } from "@/features/platform/components/club-card";
import { setPrimaryClubAction } from "@/app/actions/profile-actions";
import type { Club } from "@/types/club";

export function MyClubCard({
  club,
  tournamentCount,
  memberCount,
  badge,
  isPrimary,
}: {
  club: Club;
  tournamentCount: number;
  memberCount: number;
  badge?: string;
  isPrimary: boolean;
}) {
  const [isPending, startTransition] = React.useTransition();

  function handleSetPrimary() {
    startTransition(async () => {
      const result = await setPrimaryClubAction(club.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`${club.name} set as your primary club.`);
    });
  }

  return (
    <div className="space-y-2">
      <ClubCard club={club} tournamentCount={tournamentCount} memberCount={memberCount} badge={badge} />
      {isPrimary ? (
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <Star className="size-3.5 fill-primary" /> Primary Club
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isPending}
          onClick={handleSetPrimary}
        >
          <Star className="size-3.5" /> Set as Primary
        </Button>
      )}
    </div>
  );
}
