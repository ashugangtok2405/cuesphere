"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadClubLogoAction } from "@/app/actions/club-logo-actions";

export function ClubLogoUpload({
  clubSlug,
  initialLogoUrl,
}: {
  clubSlug: string;
  initialLogoUrl: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = React.useState(initialLogoUrl);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be 2MB or smaller.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadClubLogoAction(clubSlug, formData);
    setIsUploading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setLogoUrl(result.logoUrl);
    toast.success("Logo updated.");
  }

  return (
    <div className="space-y-2">
      <Label>Club Logo</Label>
      <div className="flex items-center gap-4">
        <div
          className={`flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border ${logoUrl ? "bg-white" : "bg-card"}`}
        >
          {logoUrl ? (
            <Image src={logoUrl} alt="Club logo" width={64} height={64} className="size-full object-contain p-1.5" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No logo</span>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Upload Logo
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WEBP or SVG. Max 2MB. This is shown as a circle everywhere, so a square,
            centered image works best.
          </p>
        </div>
      </div>
    </div>
  );
}
