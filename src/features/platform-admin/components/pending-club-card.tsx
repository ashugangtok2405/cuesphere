"use client";

import * as React from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { approveClubAction, rejectClubAction } from "@/app/actions/platform-actions";
import type { Club } from "@/types/club";

export function PendingClubCard({ club }: { club: Club }) {
  const [isPending, setIsPending] = React.useState(false);
  const [resolved, setResolved] = React.useState(false);

  async function handle(action: (id: string) => Promise<{ success: boolean; error?: string }>) {
    setIsPending(true);
    const result = await action(club.id);
    setIsPending(false);

    if (!result.success) {
      toast.error(result.error ?? "Something went wrong.");
      return;
    }

    setResolved(true);
  }

  if (resolved) return null;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div>
          <p className="font-heading text-base font-semibold text-foreground">{club.name}</p>
          {club.tagline ? (
            <p className="text-sm text-muted-foreground">{club.tagline}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">/c/{club.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handle(rejectClubAction)}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Reject
          </Button>
          <Button size="sm" disabled={isPending} onClick={() => handle(approveClubAction)}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
