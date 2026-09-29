"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { saveOverlayOptionsAction } from "@/app/actions/club-screen-actions";
import { ACCENT_OPTIONS, type OverlayToggles } from "@/types/stream";

const OPTIONS: { key: keyof OverlayToggles; label: string }[] = [
  { key: "photos", label: "Player photos" },
  { key: "breakBalls", label: "Balls potted in the current break" },
  { key: "intro", label: "Match intro card and “up next” between matches" },
  { key: "bigBreakAlert", label: "Alert for 50+ and century breaks" },
  { key: "frameBanner", label: "Frame winner banner (8 seconds)" },
  { key: "reds", label: "Reds and points left" },
];

export function OverlayOptionsForm({
  clubSlug,
  initialAccent,
  initialShow,
}: {
  clubSlug: string;
  initialAccent: string;
  initialShow: OverlayToggles;
}) {
  const router = useRouter();
  const [accent, setAccent] = React.useState(initialAccent);
  const [show, setShow] = React.useState(initialShow);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setBusy(true);
    const result = await saveOverlayOptionsAction(clubSlug, { accent, show });
    setBusy(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Overlay updated. Live streams pick it up within seconds.");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <p className="font-heading text-base font-bold text-foreground">What the overlay shows</p>
      <div className="space-y-3">
        {OPTIONS.map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
            <Checkbox
              checked={show[key]}
              onCheckedChange={(checked) => setShow((s) => ({ ...s, [key]: checked === true }))}
              className="size-5"
            />
            {label}
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Accent colour</p>
        <div className="flex gap-2.5" role="radiogroup" aria-label="Accent colour">
          {ACCENT_OPTIONS.map((colour) => (
            <button
              key={colour}
              type="button"
              role="radio"
              aria-checked={accent === colour}
              aria-label={`Accent ${colour}`}
              onClick={() => setAccent(colour)}
              className={cn(
                "size-10 rounded-full transition",
                accent === colour ? "ring-3 ring-foreground ring-offset-2 ring-offset-card" : "ring-1 ring-border-strong"
              )}
              style={{ background: colour }}
            />
          ))}
        </div>
      </div>
      <Button className="h-11 w-full sm:w-auto" disabled={busy} onClick={save}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Save overlay settings
      </Button>
    </div>
  );
}
