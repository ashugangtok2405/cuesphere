"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/** Copies a site path as a full URL (e.g. to paste into OBS or a TV browser). */
export function CopyLinkButton({ path, label }: { path: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy — the link is ${url}`);
    }
  }

  return (
    <Button variant="outline" size="sm" className="h-10 flex-1 sm:flex-none" onClick={copy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label}
    </Button>
  );
}
