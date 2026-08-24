import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getClubBySlug } from "@/services/club-service";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}): Promise<Metadata> {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  return { title: club ? `Privacy Policy — ${club.name}` : "Privacy Policy" };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  return (
    <div>
      <PageHero
        title="Privacy Policy"
        description={`How ${club.name} handles your data.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {club.privacyPolicyText || `${club.name} hasn't published a privacy policy yet.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
