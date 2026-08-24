import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info, ShieldCheck, Users } from "lucide-react";

import { getClubBySlug } from "@/services/club-service";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}): Promise<Metadata> {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  return { title: club ? `About — ${club.name}` : "About" };
}

function InfoSection({
  id,
  icon: Icon,
  title,
  content,
  fallback,
}: {
  id?: string;
  icon: React.ElementType;
  title: string;
  content: string;
  fallback: string;
}) {
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wide">
          <Icon className="size-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {content || fallback}
        </p>
      </CardContent>
    </Card>
  );
}

export default async function AboutPage({
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
        title="About Us"
        description={`Everything you need to know about ${club.name}.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <InfoSection
          icon={Info}
          title="About"
          content={club.aboutText}
          fallback={`${club.name} hasn't added an about section yet.`}
        />
        <InfoSection
          id="rules"
          icon={ShieldCheck}
          title="Rules"
          content={club.rulesText}
          fallback={`${club.name} hasn't published its rules yet.`}
        />
        <InfoSection
          id="membership"
          icon={Users}
          title="Membership"
          content={club.membershipText}
          fallback={`${club.name} hasn't published membership details yet.`}
        />
      </div>
    </div>
  );
}
