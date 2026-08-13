import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Trophy, Radio, Users, ArrowRight } from "lucide-react";

import { listClubs, listMembershipsForUser, getClubById } from "@/services/club-service";
import { getSession } from "@/lib/auth/session";
import { clubPath } from "@/lib/club-path";
import { PlatformHeader } from "@/components/layout/platform-header";
import { PlatformFooter } from "@/components/layout/platform-footer";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "CueSphere — The Complete Operating System for Snooker & Pool Clubs" };

export default async function LandingPage() {
  const session = await getSession();
  if (session) {
    const memberships = await listMembershipsForUser(session.id);
    const ownedMembership = memberships.find((m) => m.role === "club_admin");
    if (ownedMembership) {
      const club = await getClubById(ownedMembership.clubId);
      if (club) redirect(clubPath(club.slug));
    }
  }

  const clubs = (await listClubs()).filter((club) => club.status === "approved");

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <Image
            src="/images/landing-hero.jpg"
            alt="Snooker balls on a table"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              For Snooker &amp; Pool Clubs
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              The Complete Operating System for Snooker &amp; Pool Clubs
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">
              Tournaments, live scoring, player registrations, payments and rankings — all in one
              branded portal for your club. CueSphere gives every club its own home online, without
              writing a line of code.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LinkButton href="/clubs/new" size="lg">
                Create Your Club <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/clubs" variant="outline" size="lg">
                Browse Clubs
              </LinkButton>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-start gap-3 pt-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="size-5" />
                </span>
                <p className="font-heading text-base font-semibold text-foreground">
                  Run Tournaments
                </p>
                <p className="text-sm text-muted-foreground">
                  Registration, draws, fixtures and results — managed end to end for every event
                  your club hosts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-start gap-3 pt-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Radio className="size-5" />
                </span>
                <p className="font-heading text-base font-semibold text-foreground">
                  Live Scoring
                </p>
                <p className="text-sm text-muted-foreground">
                  Frame-by-frame live match centres your players and fans can follow in real time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-start gap-3 pt-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="size-5" />
                </span>
                <p className="font-heading text-base font-semibold text-foreground">
                  One Account, Every Club
                </p>
                <p className="text-sm text-muted-foreground">
                  Players sign up once and can join as many clubs as they like, keeping their
                  history with each.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="clubs" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Clubs on CueSphere</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find your club, or explore what other clubs are running.
              </p>
            </div>
          </div>

          {clubs.length === 0 ? (
            <EmptyState
              icon={<Trophy className="size-6" />}
              title="No clubs yet"
              description="Be the first to bring your club onto CueSphere."
              action={<LinkButton href="/clubs/new">Create Your Club</LinkButton>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <LinkButton
                  key={club.id}
                  href={`/c/${club.slug}`}
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 whitespace-normal p-5 text-left"
                >
                  <span className="font-heading text-base font-semibold text-foreground">
                    {club.name}
                  </span>
                  {club.tagline ? (
                    <span className="text-sm text-muted-foreground">{club.tagline}</span>
                  ) : null}
                </LinkButton>
              ))}
            </div>
          )}
        </section>
      </main>

      <PlatformFooter />
    </div>
  );
}
