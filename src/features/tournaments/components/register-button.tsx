"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";

import { useViewer } from "@/components/shared/viewer-provider";
import { useClub } from "@/components/shared/club-provider";
import { Button, type buttonVariants } from "@/components/ui/button";
import { LoginRequiredModal } from "@/features/auth/components/login-required-modal";
import type { VariantProps } from "class-variance-authority";
import type { Tournament } from "@/types/tournament";

export function RegisterButton({
  tournament,
  className,
  size = "default",
  variant = "default",
  label: labelProp = "Register",
}: {
  tournament: Tournament;
  className?: string;
  label?: string;
} & VariantProps<typeof buttonVariants>) {
  const viewer = useViewer();
  const { basePath } = useClub();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const isFull = tournament.registeredCount >= tournament.players;
  const isClosed = !tournament.registrationOpen;
  const disabled = isFull || isClosed;
  const label = isFull ? "Full" : isClosed ? "Closed" : labelProp;

  function handleClick() {
    if (disabled) return;

    if (!viewer.user) {
      setShowLoginModal(true);
      return;
    }

    if (!viewer.isProfileComplete) {
      router.push(
        `${basePath}/account/profile?redirect=${encodeURIComponent(`${basePath}/tournaments/${tournament.slug}/register`)}`
      );
      return;
    }

    router.push(`${basePath}/tournaments/${tournament.slug}/register`);
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled}
        size={size}
        variant={disabled ? "secondary" : variant}
        className={className}
      >
        <UserRound className="size-3.5" /> {label}
      </Button>
      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        redirectTo={`${basePath}/tournaments/${tournament.slug}`}
      />
    </>
  );
}
