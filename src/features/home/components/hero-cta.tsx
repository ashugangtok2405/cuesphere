"use client";

import { ArrowRight, Play, Radio, Trophy } from "lucide-react";

import { useClub } from "@/components/shared/club-provider";
import { useClubViewer } from "@/components/shared/club-viewer-provider";
import { LinkButton } from "@/components/shared/link-button";

export function HeroCta() {
  const { basePath } = useClub();
  const clubViewer = useClubViewer();

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {clubViewer.currentMatchId ? (
        <LinkButton href={`${basePath}/live/${clubViewer.currentMatchId}`} size="lg">
          <Radio className="size-4" /> Go To My Match
        </LinkButton>
      ) : clubViewer.activeRegistrationId ? (
        <LinkButton href={`${basePath}/dashboard/tournaments/${clubViewer.activeRegistrationId}`} size="lg">
          <Trophy className="size-4" /> View My Tournament
        </LinkButton>
      ) : (
        <LinkButton href={`${basePath}/tournaments?status=registration-open`} size="lg">
          Register for Tournament <ArrowRight className="size-4" />
        </LinkButton>
      )}
      <LinkButton href={`${basePath}/live`} variant="outline" size="lg">
        Watch Live <Play className="size-4" />
      </LinkButton>
    </div>
  );
}
