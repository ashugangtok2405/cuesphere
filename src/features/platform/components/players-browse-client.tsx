"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, UserPlus, Clock, Check, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  sendFriendRequestAction,
  respondToFriendRequestAction,
  removeFriendshipAction,
} from "@/app/actions/friendship-actions";
import type { PlayerProfile } from "@/types/player-profile";

export type PlayerRelation = "none" | "outgoing" | "incoming" | "friends";

export interface PlayerDirectoryEntry {
  profile: PlayerProfile;
  relation: PlayerRelation;
  friendshipId?: string;
  primaryClubName?: string;
}

export function PlayerNameWithClub({ entry }: { entry: PlayerDirectoryEntry }) {
  return (
    <p className="truncate font-heading text-sm font-bold text-foreground hover:text-primary">
      {entry.profile.fullName}
      {entry.primaryClubName ? (
        <span className="ml-1.5 font-medium text-success">({entry.primaryClubName})</span>
      ) : null}
    </p>
  );
}

export function PlayerAvatar({ profile }: { profile: PlayerProfile }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-sm font-bold text-primary">
      {profile.profilePhotoUrl ? (
        <Image src={profile.profilePhotoUrl} alt={profile.fullName} width={48} height={48} className="size-full object-cover" />
      ) : (
        profile.fullName.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export function PlayerActions({ entry }: { entry: PlayerDirectoryEntry }) {
  const [relation, setRelation] = React.useState(entry.relation);
  const [friendshipId, setFriendshipId] = React.useState(entry.friendshipId);
  const [isPending, startTransition] = React.useTransition();

  function handleSend() {
    startTransition(async () => {
      const result = await sendFriendRequestAction(entry.profile.userId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setRelation("outgoing");
      toast.success(`Friend request sent to ${entry.profile.fullName}.`);
    });
  }

  function handleRespond(accept: boolean) {
    if (!friendshipId) return;
    startTransition(async () => {
      const result = await respondToFriendRequestAction(friendshipId, accept);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setRelation(accept ? "friends" : "none");
      toast.success(accept ? `You and ${entry.profile.fullName} are now friends.` : "Request declined.");
    });
  }

  function handleRemove() {
    if (!friendshipId) return;
    startTransition(async () => {
      const result = await removeFriendshipAction(friendshipId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setRelation("none");
      setFriendshipId(undefined);
      toast.success("Removed.");
    });
  }

  if (relation === "friends") {
    return (
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleRemove}>
        <Users className="size-3.5" /> Friends
      </Button>
    );
  }

  if (relation === "outgoing") {
    return (
      <Button variant="outline" size="sm" disabled className="text-muted-foreground">
        <Clock className="size-3.5" /> Requested
      </Button>
    );
  }

  if (relation === "incoming") {
    return (
      <div className="flex items-center gap-1.5">
        <Button size="sm" disabled={isPending} onClick={() => handleRespond(true)}>
          <Check className="size-3.5" /> Accept
        </Button>
        <Button variant="outline" size="icon" disabled={isPending} onClick={() => handleRespond(false)} aria-label="Decline">
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" disabled={isPending} onClick={handleSend}>
      <UserPlus className="size-3.5" /> Add Friend
    </Button>
  );
}

export function PlayersBrowseClient({
  entries,
  isLoggedIn,
}: {
  entries: PlayerDirectoryEntry[];
  isLoggedIn: boolean;
}) {
  const [search, setSearch] = React.useState("");

  const filtered = entries.filter(({ profile }) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return profile.fullName.toLowerCase().includes(q) || profile.city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search players by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={<Users className="size-6" />} title="No players yet" description="Player profiles will show up here as people join." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Search className="size-6" />} title="No players match your search" description="Try a different name or city." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <div
              key={entry.profile.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <Link href={`/players/${entry.profile.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <PlayerAvatar profile={entry.profile} />
                <div className="min-w-0 flex-1">
                  <PlayerNameWithClub entry={entry} />
                  {entry.profile.city ? (
                    <p className="truncate text-xs text-muted-foreground">{entry.profile.city}</p>
                  ) : null}
                </div>
              </Link>
              {isLoggedIn ? <PlayerActions entry={entry} /> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
