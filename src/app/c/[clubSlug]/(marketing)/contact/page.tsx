import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

import { getClubBySlug } from "@/services/club-service";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}): Promise<Metadata> {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  return { title: club ? `Contact — ${club.name}` : "Contact" };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  const hasAnyDetails = club.address || club.phone || club.email;

  return (
    <div>
      <PageHero
        title="Contact Us"
        description={`Get in touch with ${club.name}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="space-y-4 pt-6">
            {!hasAnyDetails ? (
              <p className="text-sm text-muted-foreground">
                {club.name} hasn't added contact details yet.
              </p>
            ) : (
              <>
                {club.address ? (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground">{club.address}</span>
                  </div>
                ) : null}
                {club.phone ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 shrink-0 text-primary" />
                    <a href={`tel:${club.phone}`} className="text-foreground hover:text-primary">
                      {club.phone}
                    </a>
                  </div>
                ) : null}
                {club.email ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 shrink-0 text-primary" />
                    <a href={`mailto:${club.email}`} className="text-foreground hover:text-primary">
                      {club.email}
                    </a>
                  </div>
                ) : null}
              </>
            )}

            {club.googleMapsUrl ? (
              <LinkButton href={club.googleMapsUrl} variant="outline" size="sm" className="mt-2">
                View on Google Maps
              </LinkButton>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
