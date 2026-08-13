"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function AvatarUpload({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  name: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-background/40 transition-colors hover:border-primary/50",
          value && "border-solid border-primary/40"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={name} className="size-full object-cover" />
        ) : (
          <Camera className="size-6 text-muted-foreground group-hover:text-primary" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          Change
        </span>
      </button>
      <div>
        <p className="text-sm font-medium text-foreground">Profile Photo</p>
        <p className="text-xs text-muted-foreground">JPG or PNG, at least 300x300px.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
