"use server";

import { getSession } from "@/lib/auth/session";
import { getClubBySlug, getMembership, updateClub } from "@/services/club-service";
import { isStaffRole } from "@/types/club";

export async function updateClubSettingsAction(
  clubSlug: string,
  input: {
    name: string;
    tagline?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    googleMapsUrl?: string;
    socialLinks?: Record<string, string>;
    aboutText?: string;
    rulesText?: string;
    membershipText?: string;
    privacyPolicyText?: string;
  }
) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "You must be logged in." };

  const club = await getClubBySlug(clubSlug);
  if (!club) return { success: false as const, error: "Club not found." };

  const membership = await getMembership(club.id, session.id);
  if (!isStaffRole(membership?.role)) {
    return { success: false as const, error: "You don't have permission to manage this club." };
  }

  if (!input.name.trim()) {
    return { success: false as const, error: "Enter a club name." };
  }

  try {
    await updateClub(club.id, {
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      address: input.address,
      phone: input.phone,
      email: input.email,
      googleMapsUrl: input.googleMapsUrl,
      socialLinks: input.socialLinks,
      aboutText: input.aboutText,
      rulesText: input.rulesText,
      membershipText: input.membershipText,
      privacyPolicyText: input.privacyPolicyText,
    });
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Failed to save settings." };
  }
  return { success: true as const };
}
