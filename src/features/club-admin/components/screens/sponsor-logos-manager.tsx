"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { removeSponsorLogoAction, uploadSponsorLogoAction } from "@/app/actions/club-screen-actions";
import { MAX_SPONSOR_LOGOS } from "@/types/stream";

/** Up to three sponsor logos, shown top-right on every table's stream overlay. */
export function SponsorLogosManager({ clubSlug, logos }: { clubSlug: string; logos: string[] }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function upload(file: File) {
    setBusy("upload");
    const data = new FormData();
    data.append("file", file);
    const result = await uploadSponsorLogoAction(clubSlug, data);
    setBusy(null);
    if (inputRef.current) inputRef.current.value = "";
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Sponsor logo added");
    router.refresh();
  }

  async function remove(url: string) {
    setBusy(url);
    const result = await removeSponsorLogoAction(clubSlug, url);
    setBusy(null);
    if (!result.success) toast.error(result.error);
    else router.refresh();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="font-heading text-base font-bold text-foreground">Sponsor logos</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Shown top-right on the stream. A square PNG with a transparent background works best (max 2MB).
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {logos.map((url) => (
          <div key={url} className="relative">
            <div className="relative size-20 overflow-hidden rounded-full bg-white">
              <Image src={url} alt="Sponsor logo" fill unoptimized className="object-contain p-2" />
            </div>
            <button
              type="button"
              aria-label="Remove sponsor logo"
              disabled={busy !== null}
              onClick={() => remove(url)}
              className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full border border-border bg-card text-destructive"
            >
              {busy === url ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </button>
          </div>
        ))}
        {logos.length < MAX_SPONSOR_LOGOS ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => inputRef.current?.click()}
            className="flex size-20 flex-col items-center justify-center gap-1 rounded-full border border-dashed border-border-strong text-xs text-muted-foreground hover:text-foreground"
          >
            {busy === "upload" ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
            Add logo
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </div>
  );
}
