"use server";

import { getSession } from "@/lib/auth/session";
import { isPlatformAdmin, approveClub, rejectClub } from "@/services/club-service";

async function requirePlatformAdmin() {
  const session = await getSession();
  if (!session || !(await isPlatformAdmin(session.id))) {
    return { ok: false as const, error: "You are not authorized to do this." };
  }
  return { ok: true as const };
}

export async function approveClubAction(clubId: string) {
  const check = await requirePlatformAdmin();
  if (!check.ok) return { success: false as const, error: check.error };

  await approveClub(clubId);
  return { success: true as const };
}

export async function rejectClubAction(clubId: string) {
  const check = await requirePlatformAdmin();
  if (!check.ok) return { success: false as const, error: check.error };

  await rejectClub(clubId);
  return { success: true as const };
}
