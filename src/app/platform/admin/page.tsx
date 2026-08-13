import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { isPlatformAdmin, listClubs } from "@/services/club-service";
import { PlatformHeader } from "@/components/layout/platform-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PendingClubCard } from "@/features/platform-admin/components/pending-club-card";

export const metadata: Metadata = { title: "Platform Admin" };

export default async function PlatformAdminPage() {
  const session = await getSession();
  if (!session || !(await isPlatformAdmin(session.id))) {
    notFound();
  }

  const clubs = await listClubs();
  const pending = clubs.filter((club) => club.status === "pending");
  const approved = clubs.filter((club) => club.status === "approved");

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Platform Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review club registration requests before they go live on CueSphere.
          </p>

          <section className="mt-10">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Pending Approval ({pending.length})
            </h2>
            <div className="mt-4 space-y-4">
              {pending.length === 0 ? (
                <EmptyState
                  icon={<ShieldCheck className="size-6" />}
                  title="No pending requests"
                  description="New club registrations will show up here for your review."
                />
              ) : (
                pending.map((club) => <PendingClubCard key={club.id} club={club} />)
              )}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Live Clubs ({approved.length})
            </h2>
            <div className="mt-4 space-y-2">
              {approved.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{club.name}</span>
                  <span className="text-xs text-muted-foreground">/c/{club.slug}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
