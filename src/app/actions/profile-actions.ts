"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateProfile } from "@/services/profile-service";

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  mobile: z.string().min(8, "Enter a valid mobile number."),
  dob: z.string().min(1, "Date of birth is required."),
  city: z.string().min(1, "City is required."),
  emergencyContact: z.string().min(8, "Enter a valid emergency contact number."),
  profilePhotoUrl: z.string().min(1, "Please add a profile photo."),
  preferredCue: z.string().optional(),
});

export async function updateProfileAction(input: z.infer<typeof profileSchema>) {
  const session = await getSession();
  if (!session) {
    return { success: false as const, error: "You must be logged in." };
  }

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const profile = await updateProfile(session.id, {
    ...parsed.data,
    preferredCue: parsed.data.preferredCue ?? "",
  });

  return { success: true as const, profile };
}
