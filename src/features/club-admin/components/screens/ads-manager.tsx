"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { removeAdImageAction, saveAdOptionsAction, uploadAdImageAction } from "@/app/actions/club-screen-actions";
import { selectClass } from "@/features/club-admin/components/screens/pair-tv-form";
import { AD_SECONDS_OPTIONS, MAX_AD_IMAGES, type AdSettings } from "@/types/stream";

type AdOptions = Omit<AdSettings, "images">;

const SWITCHES: { key: keyof Omit<AdOptions, "secondsPerImage">; label: string }[] = [
  { key: "enabled", label: "Play ads during frame breaks" },
  { key: "onTv", label: "On the table TVs" },
  { key: "onOverlay", label: "On the live stream (covers the camera during the break)" },
  { key: "afterMatch", label: "Keep playing ads on the result screen after the match" },
];

/** Ad images shown full-screen between frames, from End Frame until the
 * referee starts the next frame. */
export function AdsManager({ clubSlug, ads }: { clubSlug: string; ads: AdSettings }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [options, setOptions] = React.useState<AdOptions>({
    enabled: ads.enabled,
    secondsPerImage: ads.secondsPerImage,
    onTv: ads.onTv,
    onOverlay: ads.onOverlay,
    afterMatch: ads.afterMatch,
  });
  const [busy, setBusy] = React.useState<string | null>(null);

  async function upload(files: FileList) {
    setBusy("upload");
    for (const file of Array.from(files).slice(0, MAX_AD_IMAGES - ads.images.length)) {
      const data = new FormData();
      data.append("file", file);
      const result = await uploadAdImageAction(clubSlug, data);
      if (!result.success) {
        toast.error(`${file.name}: ${result.error}`);
        break;
      }
    }
    setBusy(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function remove(url: string) {
    setBusy(url);
    const result = await removeAdImageAction(clubSlug, url);
    setBusy(null);
    if (!result.success) toast.error(result.error);
    else router.refresh();
  }

  async function saveOptions() {
    setBusy("options");
    const result = await saveAdOptionsAction(clubSlug, options);
    setBusy(null);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Ad settings saved");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="font-heading text-base font-bold text-foreground">Ads between frames</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          When the referee taps End Frame, these images rotate full-screen until they start the next frame. Use
          1920×1080 images (PNG, JPG or WEBP, under 5MB). Up to {MAX_AD_IMAGES}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ads.images.map((url, i) => (
          <div key={url} className="relative">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">
              <Image src={url} alt={`Ad ${i + 1}`} fill unoptimized className="object-contain" />
            </div>
            <button
              type="button"
              aria-label={`Remove ad ${i + 1}`}
              disabled={busy !== null}
              onClick={() => remove(url)}
              className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full border border-border bg-card text-destructive"
            >
              {busy === url ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </button>
          </div>
        ))}
        {ads.images.length < MAX_AD_IMAGES ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-strong text-sm text-muted-foreground hover:text-foreground"
          >
            {busy === "upload" ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
            Add ads
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
        }}
      />

      <div className="space-y-3">
        {SWITCHES.map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
            <Checkbox
              checked={options[key]}
              onCheckedChange={(checked) => setOptions((o) => ({ ...o, [key]: checked === true }))}
              className="size-5"
            />
            {label}
          </label>
        ))}
        <div className="flex items-center gap-3">
          <label htmlFor="adSeconds" className="text-sm text-foreground">
            Show each ad for
          </label>
          <select
            id="adSeconds"
            className={cn(selectClass, "w-36")}
            value={options.secondsPerImage}
            onChange={(e) => setOptions((o) => ({ ...o, secondsPerImage: Number(e.target.value) }))}
          >
            {AD_SECONDS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} seconds
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button className="h-11 w-full sm:w-auto" disabled={busy !== null} onClick={saveOptions}>
        {busy === "options" ? <Loader2 className="size-4 animate-spin" /> : null}
        Save ad settings
      </Button>
    </div>
  );
}
