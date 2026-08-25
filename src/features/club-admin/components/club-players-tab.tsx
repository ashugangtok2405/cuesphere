"use client";

import * as React from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { PlayerLink } from "@/features/club-admin/components/player-link";
import { updateRegistrationPaymentStatusAction } from "@/app/actions/club-tournament-actions";
import type { PlayerProfile } from "@/types/player-profile";
import type { TournamentRegistration } from "@/types/registration";

function PlayerRow({
  clubSlug,
  registration,
  profile,
  index,
  canManagePayments,
}: {
  clubSlug: string;
  registration: TournamentRegistration;
  profile: PlayerProfile | undefined;
  index: number;
  canManagePayments: boolean;
}) {
  const [paymentStatus, setPaymentStatus] = React.useState(registration.paymentStatus);
  const [isPending, startTransition] = React.useTransition();

  const isPaid = paymentStatus === "paid";
  const paymentBadge = (
    <Badge
      className={
        isPaid
          ? "border-success/40 bg-success/15 text-success"
          : "border-destructive/40 bg-destructive/15 text-destructive"
      }
    >
      {isPaid ? "Paid" : "Pending"}
    </Badge>
  );

  function handleToggle() {
    const next = isPaid ? "pending" : "paid";
    startTransition(async () => {
      const result = await updateRegistrationPaymentStatusAction(clubSlug, registration.id, next);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setPaymentStatus(next);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-tabular text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="font-medium">
        {profile ? (
          <PlayerLink clubSlug={clubSlug} playerId={profile.id} className="flex items-center gap-2.5 hover:text-primary">
            <AvatarInitials name={profile.fullName || "Unknown Player"} photoUrl={profile.profilePhotoUrl} size="sm" />
            {profile.fullName || "Unknown Player"}
          </PlayerLink>
        ) : (
          <div className="flex items-center gap-2.5">
            <AvatarInitials name="Unknown Player" size="sm" />
            Unknown Player
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        {canManagePayments ? (
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className="cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
            title={`Mark as ${isPaid ? "pending" : "paid"}`}
          >
            {paymentBadge}
          </button>
        ) : (
          paymentBadge
        )}
      </TableCell>
      <TableCell className="text-right">
        <Badge variant={isPaid ? "default" : "secondary"}>{isPaid ? "Confirmed" : "Registered"}</Badge>
      </TableCell>
    </TableRow>
  );
}

export function ClubPlayersTab({
  clubSlug,
  players,
  canManagePayments = false,
}: {
  clubSlug: string;
  players: { registration: TournamentRegistration; profile: PlayerProfile | undefined }[];
  canManagePayments?: boolean;
}) {
  const [search, setSearch] = React.useState("");

  if (players.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="No registrations yet"
        description="Registered players will appear here once players sign up."
      />
    );
  }

  const filtered = players.filter(({ profile }) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (profile?.fullName ?? "unknown player").toLowerCase().includes(q);
  });

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="size-6" />} title="No players match your search" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Payment</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ registration, profile }, i) => (
                <PlayerRow
                  key={registration.id}
                  clubSlug={clubSlug}
                  registration={registration}
                  profile={profile}
                  index={i}
                  canManagePayments={canManagePayments}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
