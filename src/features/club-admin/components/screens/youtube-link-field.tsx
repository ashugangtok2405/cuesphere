"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveYoutubeLinkAction } from "@/app/actions/club-screen-actions";

/** The table's YouTube watch link, shown on the club's live match page. */
export function YoutubeLinkField({ clubSlug, table, initial }: { clubSlug: string; table: number; initial: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);
  const id = `yt-${table}`;

  async function save() {
    setBusy(true);
    const result = await saveYoutubeLinkAction(clubSlug, table, value);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(value.trim() ? "YouTube link saved" : "YouTube link removed");
    router.refresh();
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        YouTube link
      </label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://youtube.com/live/…"
          className="h-10"
        />
        <Button variant="outline" size="sm" className="h-10" disabled={busy || value === initial} onClick={save}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Save
        </Button>
      </div>
    </div>
  );
}
