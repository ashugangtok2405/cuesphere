import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";

import { clubPath } from "@/lib/club-path";
import { getClubBySlug } from "@/services/club-service";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ clubSlug: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { clubSlug } = await params;
  const club = await getClubBySlug(clubSlug);
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : clubPath(clubSlug);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden felt-texture lg:block">
        {club?.heroBannerUrl ? (
          <Image
            src={club.heroBannerUrl}
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-grid-fade opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
        <div className="absolute -left-24 top-1/3 size-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="relative flex h-full flex-col items-start justify-center px-16">
          <Trophy className="size-12 text-primary drop-shadow-[0_0_24px_rgba(212,175,55,0.5)]" />
          <h2 className="mt-6 max-w-sm text-3xl font-bold text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Welcome back to the table.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Sign in to register for tournaments, track your matches and follow your ranking.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {club?.name ?? "XYZ Snooker Club"}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account.
          </p>

          <div className="mt-8">
            <LoginForm redirectTo={redirectTo} clubSlug={clubSlug} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`${clubPath(clubSlug, "/register")}?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
