import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/shared/page-transition";
import { getSession } from "@/lib/auth/session";
import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { JoinClubBanner } from "@/features/clubs/components/join-club-banner";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const [session, clubViewer] = await Promise.all([getSession(), getClubViewer(clubSlug)]);
  const showJoinBanner = !!session && !!clubViewer && !clubViewer.membership;

  return (
    <>
      <Navbar />
      {showJoinBanner ? <JoinClubBanner /> : null}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
