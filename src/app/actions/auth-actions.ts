"use server";

import { z } from "zod";
import { destroySession } from "@/lib/auth/session";
import { signIn, signUp } from "@/services/auth-service";
import { ensureProfileForUser } from "@/services/profile-service";
import { ensurePlayerMembership, getClubBySlug } from "@/services/club-service";
import { getActiveScorekeeperAssignment } from "@/services/tournament-scorekeeper-service";
import { clubPath } from "@/lib/club-path";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  clubSlug: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  clubSlug: z.string().optional(),
});

async function joinClubIfProvided(userId: string, clubSlug: string | undefined) {
  if (!clubSlug) return;
  const club = await getClubBySlug(clubSlug);
  if (club) await ensurePlayerMembership(club.id, userId);
}

export async function loginAction(input: { email: string; password: string; clubSlug?: string }) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await signIn(parsed.data.email, parsed.data.password);
  if ("error" in result) {
    return { success: false as const, error: result.error };
  }

  await ensureProfileForUser(result.userId, result.email);
  await joinClubIfProvided(result.userId, parsed.data.clubSlug);

  const assignment = await getActiveScorekeeperAssignment(result.userId);
  if (assignment) {
    return { success: true as const, redirectTo: clubPath(assignment.clubSlug, "/scorekeeper") };
  }

  return { success: true as const };
}

export async function registerAccountAction(input: { email: string; password: string; clubSlug?: string }) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await signUp(parsed.data.email, parsed.data.password);
  if ("error" in result) {
    return { success: false as const, error: result.error };
  }

  if (result.needsEmailConfirmation) {
    return {
      success: false as const,
      error: "Account created — check your email to confirm it before logging in.",
    };
  }

  await ensureProfileForUser(result.userId, result.email);
  await joinClubIfProvided(result.userId, parsed.data.clubSlug);
  return { success: true as const };
}

export async function logoutAction() {
  await destroySession();
}
