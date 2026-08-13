import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ImagePlus } from "lucide-react";

import { getClubBySlug } from "@/services/club-service";
import { listGalleryImages } from "@/services/gallery-service";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}): Promise<Metadata> {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  return { title: club ? `Gallery — ${club.name}` : "Gallery" };
}

export default async function ClubGalleryPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;

  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  const images = await listGalleryImages(club.id);

  return (
    <div>
      <PageHero
        title="Gallery"
        description={`Moments from ${club.name}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {images.length === 0 ? (
          <EmptyState
            icon={<ImagePlus className="size-6" />}
            title="No photos yet"
            description={`${club.name} hasn't added any gallery photos yet. Check back soon.`}
          />
        ) : (
          <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <RevealItem key={image.id}>
                <figure className="card-hover overflow-hidden rounded-xl border border-border">
                  <div className="relative aspect-square">
                    <Image
                      src={image.imageUrl}
                      alt={image.caption || "Club gallery photo"}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="truncate bg-card px-2.5 py-2 text-xs text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
