"use client";

import { UserPlus, LogIn } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { useClub } from "@/components/shared/club-provider";

export function LoginRequiredModal({
  open,
  onOpenChange,
  redirectTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo: string;
}) {
  const { basePath } = useClub();
  const redirectParam = encodeURIComponent(redirectTo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            Please login or create an account to register for this tournament.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-col">
          <LinkButton href={`${basePath}/login?redirect=${redirectParam}`} className="w-full">
            <LogIn className="size-4" /> Login
          </LinkButton>
          <LinkButton href={`${basePath}/register?redirect=${redirectParam}`} variant="outline" className="w-full">
            <UserPlus className="size-4" /> Create Account
          </LinkButton>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
