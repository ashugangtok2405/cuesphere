import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";

import { PlatformHeader } from "@/components/layout/platform-header";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default async function PlatformRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/";

  return (
    <div className="flex min-h-screen flex-col">
      <PlatformHeader />
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden felt-texture lg:block">
          <Image
            src="/images/landing-hero.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-grid-fade opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
          <div className="absolute -left-24 top-1/3 size-96 rounded-full bg-primary/30 blur-[120px]" />
          <div className="relative flex h-full flex-col items-start justify-center px-16">
            <Trophy className="size-12 text-primary drop-shadow-[0_0_24px_rgba(212,175,55,0.5)]" />
            <h2 className="mt-6 max-w-sm text-3xl font-bold text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              Join the table.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Create your CueSphere account to join clubs as a player, or set up a club of your
              own.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-sm">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              CueSphere
            </span>
            <h1 className="mt-2 text-3xl font-bold text-foreground">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started in a few seconds.
            </p>

            <div className="mt-8">
              <RegisterForm redirectTo={redirectTo} />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
