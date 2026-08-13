"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/services/profile-service";
import { getProfileCompletion } from "@/types/player-profile";
import { checkRegistrationEligibility, getTournamentBySlug } from "@/services/tournament-service";
import { createRegistration } from "@/services/registration-service";
import { recordOfflinePayment, recordOnlinePayment } from "@/services/payment-service";
import { createNotification } from "@/services/notification-service";
import { getClubBySlug, ensurePlayerMembership } from "@/services/club-service";

const registrationSchema = z.object({
  clubSlug: z.string().min(1),
  slug: z.string().min(1),
  emergencyContact: z.string().min(8, "Enter a valid emergency contact number."),
  preferredCue: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["online", "offline"]),
  agreedToRules: z.literal(true, { error: "You must agree to the tournament rules." }),
});

export type RegisterForTournamentInput = z.infer<typeof registrationSchema>;

export async function registerForTournamentAction(input: RegisterForTournamentInput) {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const session = await getSession();
  if (!session) {
    return { success: false as const, error: "You must be logged in to register.", code: "unauthenticated" as const };
  }

  const club = await getClubBySlug(parsed.data.clubSlug);
  if (!club) {
    return { success: false as const, error: "Club not found." };
  }

  const profile = await getProfileByUserId(session.id);
  const { isComplete } = getProfileCompletion(profile);
  if (!profile || !isComplete) {
    return {
      success: false as const,
      error: "Please complete your profile before registering.",
      code: "incomplete_profile" as const,
    };
  }

  const tournament = getTournamentBySlug(parsed.data.slug);
  if (!tournament) {
    return { success: false as const, error: "Tournament not found." };
  }

  const eligibility = await checkRegistrationEligibility(tournament.id, profile.id);
  if (!eligibility.ok) {
    const messages: Record<typeof eligibility.reason, string> = {
      closed: "Registration for this tournament is closed.",
      full: "This tournament has reached its maximum player capacity.",
      already_registered: "You are already registered for this tournament.",
    };
    return { success: false as const, error: messages[eligibility.reason], code: eligibility.reason };
  }

  await ensurePlayerMembership(club.id, session.id);

  const registration = await createRegistration({
    clubId: club.id,
    tournamentId: tournament.id,
    playerId: profile.id,
    emergencyContact: parsed.data.emergencyContact,
    preferredCue: parsed.data.preferredCue ?? "",
    notes: parsed.data.notes ?? "",
    agreedToRules: parsed.data.agreedToRules,
    status: parsed.data.paymentMethod === "online" ? "confirmed" : "pending_approval",
  });

  const payment =
    parsed.data.paymentMethod === "online"
      ? await recordOnlinePayment(club.id, registration.id, tournament.entryFee)
      : await recordOfflinePayment(club.id, registration.id, tournament.entryFee);

  await createNotification(
    club.id,
    session.id,
    "Registration Successful",
    `Congratulations! You have successfully registered for ${tournament.name}. We look forward to seeing you at ${club.name}.`
  );

  return {
    success: true as const,
    registrationId: registration.id,
    registrationNumber: registration.registrationNumber,
    paymentStatus: payment.status,
  };
}
