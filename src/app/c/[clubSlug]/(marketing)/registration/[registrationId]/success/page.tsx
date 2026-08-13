import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getRegistrationById } from "@/services/registration-service";
import { getProfileById } from "@/services/profile-service";
import { getPaymentForRegistration } from "@/services/payment-service";
import { getClubBySlug, getMembership } from "@/services/club-service";
import { clubPath } from "@/lib/club-path";
import { TOURNAMENTS } from "@/lib/mock/tournaments";
import { getTournamentDetail } from "@/lib/mock/tournament-detail";
import { SuccessScreen } from "@/features/registration/components/success-screen";

export const metadata: Metadata = { title: "Registration Successful" };

export default async function RegistrationSuccessPage({
  params,
}: {
  params: Promise<{ clubSlug: string; registrationId: string }>;
}) {
  const { clubSlug, registrationId } = await params;
  const club = await getClubBySlug(clubSlug);
  if (!club) notFound();

  const session = await getSession();
  if (!session) {
    redirect(clubPath(clubSlug, "/login"));
  }

  const registration = await getRegistrationById(registrationId);
  if (!registration || registration.clubId !== club.id) {
    notFound();
  }

  const profile = await getProfileById(registration.playerId);
  const base = TOURNAMENTS.find((t) => t.id === registration.tournamentId);
  const tournament = base ? getTournamentDetail(base.slug) : undefined;
  const payment = await getPaymentForRegistration(registration.id);
  const membership = profile ? await getMembership(club.id, profile.userId) : undefined;

  if (!profile || !base || !tournament || !payment) {
    notFound();
  }

  return (
    <SuccessScreen
      tournamentName={tournament.name}
      tournamentSlug={tournament.slug}
      playerName={profile.fullName}
      memberId={membership?.memberId || profile.memberId}
      registrationNumber={registration.registrationNumber}
      paymentStatus={payment.status === "paid" ? "paid" : "pending"}
      tournamentStatusLabel={registration.status === "confirmed" ? "Confirmed" : "Pending Approval"}
      drawReleaseDate={tournament.drawReleaseDate}
      tournamentStartDate={tournament.startDate}
    />
  );
}
