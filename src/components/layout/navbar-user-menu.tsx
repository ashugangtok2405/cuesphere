"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronDown, LayoutDashboard, LogOut, ShieldCheck, Trophy, UserCog } from "lucide-react";

import { useViewer } from "@/components/shared/viewer-provider";
import { useClub } from "@/components/shared/club-provider";
import { useClubViewer } from "@/components/shared/club-viewer-provider";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth-actions";
import { isStaffRole } from "@/types/club";

export function NavbarUserMenu() {
  const viewer = useViewer();
  const { basePath } = useClub();
  const clubViewer = useClubViewer();
  const router = useRouter();

  if (!viewer.user) {
    return (
      <LinkButton
        href={`${basePath}/login`}
        variant="outline"
        size="sm"
        className="hidden border-primary/50 text-primary hover:bg-primary/10 sm:inline-flex"
      >
        <UserCog className="size-3.5" /> Login
      </LinkButton>
    );
  }

  const displayName = viewer.profile?.fullName || viewer.user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" className="hidden gap-2 sm:inline-flex" />}
      >
        <AvatarInitials name={displayName} photoUrl={viewer.profile?.profilePhotoUrl} size="sm" />
        <span className="max-w-[8rem] truncate text-sm">{displayName}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="truncate px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {viewer.user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<a href={`${basePath}/dashboard`} />}>
          <LayoutDashboard className="size-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<a href={`${basePath}/account/profile`} />}>
          <UserCog className="size-4" />
          {viewer.isProfileComplete
            ? "My Profile"
            : `Complete Profile (${viewer.profileCompletionPercent}%)`}
        </DropdownMenuItem>
        {viewer.profile && clubViewer.membership ? (
          <DropdownMenuItem render={<a href={`${basePath}/players/${viewer.profile.id}`} />}>
            <Trophy className="size-4" /> My Stats
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem render={<a href="/my-clubs" />}>
          <Building2 className="size-4" /> My Clubs
        </DropdownMenuItem>
        {isStaffRole(clubViewer.membership?.role) ? (
          <DropdownMenuItem render={<a href={`${basePath}/admin`} />}>
            <ShieldCheck className="size-4" /> Club Admin
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await logoutAction();
            router.push(basePath);
            router.refresh();
          }}
        >
          <LogOut className="size-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
