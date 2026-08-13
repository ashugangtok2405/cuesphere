"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { useViewer } from "@/components/shared/viewer-provider";
import { logoutAction } from "@/app/actions/auth-actions";

export function PlatformHeader() {
  const viewer = useViewer();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-primary/10">
            <Image src="/branding/cuesphere-icon.png" alt="CueSphere" fill className="object-cover" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Cue<span className="text-primary">Sphere</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LinkButton href="/clubs" variant="ghost" size="sm">
            Browse Clubs
          </LinkButton>
          {!viewer.ownsClub ? (
            <LinkButton href="/clubs/new" variant="outline" size="sm">
              Create Your Club
            </LinkButton>
          ) : null}
          {viewer.user ? (
            <>
              <LinkButton href="/my-clubs" variant="ghost" size="sm">
                My Clubs
              </LinkButton>
              <LinkButton href="/account/profile" variant="ghost" size="icon" aria-label="My Profile">
                <UserCog className="size-4" />
              </LinkButton>
              <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground sm:inline">
                {viewer.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logoutAction();
                  router.push("/");
                  router.refresh();
                }}
              >
                <LogOut className="size-3.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm">
                Login
              </LinkButton>
              <LinkButton href="/register" size="sm">
                Register
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
