"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadClubCoverAction } from "@/app/actions/club-logo-actions";

export function ClubCoverUpload({
  clubSlug,
  initialCoverUrl,
}: {
  clubSlug: string;
  initialCoverUrl: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = React.useState(initialCoverUrl);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be 5MB or smaller.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadClubCoverAction(clubSlug, formData);
    setIsUploading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setCoverUrl(result.heroBannerUrl);
    toast.success("Cover image updated.");
  }

  return (
    <div className="space-y-2">
      <Label>Homepage Cover Image</Label>
      <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card sm:w-72">
        {coverUrl ? (
          <Image src={coverUrl} alt="Club cover" width={288} height={128} className="size-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No cover image</span>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
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
          Upload Cover
        </Button>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG or WEBP. Max 5MB. Recommended: wide banner (e.g. 1600×500).
        </p>
      </div>
    </div>
  );
}
