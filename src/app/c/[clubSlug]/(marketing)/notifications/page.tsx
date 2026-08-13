import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BellRing } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { listForUser, markAllRead } from "@/services/notification-service";
import { getClubBySlug } from "@/services/club-service";
import { clubPath } from "@/lib/club-path";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Notifications" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  const session = await getSession();
  if (!session) {
    redirect(
      `${clubPath(clubSlug, "/login")}?redirect=${encodeURIComponent(clubPath(clubSlug, "/notifications"))}`
    );
  }

  const notifications = await listForUser(session.id, club.id);
  await markAllRead(session.id, club.id);

  return (
    <>
      <PageHero
        title="Notifications"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Notifications" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<BellRing className="size-6" />}
            title="No notifications yet"
            description="Updates about your registrations and matches will show up here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card key={n.id}>
                <CardContent className="flex items-start gap-3 pt-6">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="size-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
