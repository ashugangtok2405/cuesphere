"use client";

import { ArrowRight, Megaphone, Plus, Image as ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { useClub } from "@/components/shared/club-provider";
import { GALLERY_HIGHLIGHTS, LATEST_NEWS } from "@/lib/mock/home";

export function NewsGallerySection() {
  const { basePath } = useClub();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4 text-primary" /> Latest News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {LATEST_NEWS.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-b-0"
              >
                <p className="text-sm text-foreground">{item.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
              </div>
            ))}
            <LinkButton href={`${basePath}/news`} variant="ghost" size="sm" className="mt-2 w-full justify-between">
              View All News <ArrowRight className="size-3.5" />
            </LinkButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4 text-primary" /> Gallery Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {GALLERY_HIGHLIGHTS.map((item) => (
                <div key={item.caption} className="space-y-1.5">
                  <div className="flex aspect-square items-center justify-center rounded-xl felt-texture">
                    <svg viewBox="0 0 24 24" className="size-6 text-primary/80" fill="currentColor">
                      <circle cx="12" cy="12" r="6" />
                    </svg>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{item.caption}</p>
                </div>
              ))}
              <LinkButton
                href={`${basePath}/gallery`}
                variant="outline"
                className="flex aspect-square h-auto w-full flex-col items-center justify-center gap-1.5 text-xs"
              >
                <Plus className="size-5" />
                View Gallery
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
