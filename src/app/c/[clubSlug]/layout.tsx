import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { ClubProvider } from "@/components/shared/club-provider";
import { ClubViewerProvider } from "@/components/shared/club-viewer-provider";
import { PlatformHeader } from "@/components/layout/platform-header";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubViewer = await getClubViewer(clubSlug);

  if (!clubViewer) {
    notFound();
  }

  if (clubViewer.club.status !== "approved") {
    return (
      <div className="flex min-h-screen flex-col">
        <PlatformHeader />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <EmptyState
            icon={<Clock className="size-6" />}
            title={`${clubViewer.club.name} is awaiting approval`}
            description="This club's page will go live as soon as a CueSphere platform admin approves it. Check back soon."
            className="max-w-md"
          />
        </main>
      </div>
    );
  }

  return (
    <ClubProvider club={clubViewer.club}>
      <ClubViewerProvider viewer={clubViewer}>{children}</ClubViewerProvider>
    </ClubProvider>
  );
}
