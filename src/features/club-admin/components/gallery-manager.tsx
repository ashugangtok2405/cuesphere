"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadGalleryImageAction, deleteGalleryImageAction } from "@/app/actions/gallery-actions";
import type { GalleryImage } from "@/types/gallery";

export function GalleryManager({
  clubSlug,
  images,
}: {
  clubSlug: string;
  images: GalleryImage[];
}) {
  const router = useRouter();
  const [caption, setCaption] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error(`"${oversized.name}" is over 5MB — skipped the whole upload.`);
      return;
    }

    setIsUploading(true);
    const results = await Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("caption", caption);
        return uploadGalleryImageAction(clubSlug, formData);
      })
    );
    setIsUploading(false);

    const failed = results.filter((r) => !r.success);
    const succeeded = results.length - failed.length;

    if (succeeded > 0) {
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(succeeded === 1 ? "Photo added." : `${succeeded} photos added.`);
      router.refresh();
    }
    if (failed.length > 0) {
      toast.error(
        failed.length === results.length
          ? failed[0]?.error ?? "Upload failed."
          : `${failed.length} of ${results.length} photos failed to upload.`
      );
    }
  }

  async function handleDelete(imageId: string) {
    setDeletingId(imageId);
    const result = await deleteGalleryImageAction(clubSlug, imageId);
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Photo removed.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 space-y-2">
          <Input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload Photos
        </Button>
      </div>
      <p className="-mt-4 text-xs text-muted-foreground">
        PNG, JPG or WEBP. Max 5MB each. Select multiple to upload them all with this caption.
      </p>

      {images.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
          <ImagePlus className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No photos uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-square">
                <Image src={image.imageUrl} alt={image.caption || "Gallery photo"} fill className="object-cover" />
              </div>
              {image.caption ? (
                <p className="truncate bg-card px-2 py-1.5 text-xs text-muted-foreground">{image.caption}</p>
              ) : null}
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                disabled={deletingId === image.id}
                onClick={() => handleDelete(image.id)}
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              >
                {deletingId === image.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
