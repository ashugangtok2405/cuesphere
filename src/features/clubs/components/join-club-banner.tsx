"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useClub } from "@/components/shared/club-provider";
import { joinClubAction } from "@/app/actions/club-membership-actions";

export function JoinClubBanner() {
  const router = useRouter();
  const { club } = useClub();
  const [isJoining, setIsJoining] = React.useState(false);

  async function handleJoin() {
    setIsJoining(true);
    const result = await joinClubAction(club.slug);
    setIsJoining(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`You've joined ${club.name}!`);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/10 px-4 py-3 sm:px-6 lg:px-8">
      <p className="text-sm text-foreground">
        You&apos;re viewing <span className="font-semibold">{club.name}</span> but haven&apos;t
        joined it yet.
      </p>
      <Button size="sm" disabled={isJoining} onClick={handleJoin}>
        {isJoining ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        Join This Club
      </Button>
    </div>
  );
}
