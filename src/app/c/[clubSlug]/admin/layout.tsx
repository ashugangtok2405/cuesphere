import { notFound } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Trophy, Settings, Radio, Image as ImageIcon } from "lucide-react";

import { getClubViewer } from "@/lib/auth/get-club-viewer";
import { getSession } from "@/lib/auth/session";
import { getActiveScorekeeperAssignment } from "@/services/tournament-scorekeeper-service";
import { clubPath } from "@/lib/club-path";
import { isScorekeeperOnly } from "@/types/club";

export default async function ClubAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const clubViewer = await getClubViewer(clubSlug);
  if (!clubViewer) notFound();

  // A tournament-scoped scorekeeper has no club membership at all — they can
  // only reach the one match-scoring page for their assigned tournament, so
  // they skip the staff sidebar entirely rather than 404ing.
  if (!clubViewer.isStaff) {
    const session = await getSession();
    const assignment = session ? await getActiveScorekeeperAssignment(session.id) : null;
    if (!assignment || assignment.clubSlug !== clubSlug) notFound();

    return <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>;
  }

  const basePath = clubPath(clubSlug, "/admin");
  const scorekeeperOnly = isScorekeeperOnly(clubViewer.membership?.role);

  const navItems = scorekeeperOnly
    ? [{ href: `${basePath}/live`, label: "Live Scoring", icon: Radio }]
    : [
        { href: basePath, label: "Overview", icon: LayoutDashboard },
        { href: `${basePath}/tournaments`, label: "Tournaments", icon: Trophy },
        { href: `${basePath}/live`, label: "Live Scoring", icon: Radio },
        { href: `${basePath}/gallery`, label: "Gallery", icon: ImageIcon },
        { href: `${basePath}/settings`, label: "Settings", icon: Settings },
      ];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="w-56 shrink-0">
        <p className="mb-4 px-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {clubViewer.club.name}
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
