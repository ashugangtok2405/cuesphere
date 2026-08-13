import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PlayerProfile } from "@/types/player-profile";

interface ProfileRow {
  id: string;
  user_id: string;
  member_id: string;
  full_name: string;
  email: string;
  mobile: string;
  dob: string | null;
  city: string;
  emergency_contact: string;
  profile_photo_url: string;
  preferred_cue: string;
  created_at: string;
}

function fromRow(row: ProfileRow): PlayerProfile {
  return {
    id: row.id,
    userId: row.user_id,
    memberId: row.member_id,
    fullName: row.full_name,
    email: row.email,
    mobile: row.mobile,
    dob: row.dob ?? "",
    city: row.city,
    emergencyContact: row.emergency_contact,
    profilePhotoUrl: row.profile_photo_url,
    preferredCue: row.preferred_cue,
    createdAt: row.created_at,
  };
}

export async function getProfileByUserId(userId: string): Promise<PlayerProfile | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("player_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data ? fromRow(data as ProfileRow) : undefined;
}

export async function getProfileById(id: string): Promise<PlayerProfile | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("player_profiles").select("*").eq("id", id).maybeSingle();
  return data ? fromRow(data as ProfileRow) : undefined;
}

/** Admin-backed lookup for public display of other members' profiles (name/photo),
 * bypassing RLS the same way getProfileById does — getProfileByUserId is RLS-scoped
 * and only ever resolves the caller's own profile. */
export async function getProfileByUserIdForDisplay(userId: string): Promise<PlayerProfile | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("player_profiles").select("*").eq("user_id", userId).maybeSingle();
  return data ? fromRow(data as ProfileRow) : undefined;
}

export async function ensureProfileForUser(userId: string, email: string): Promise<PlayerProfile> {
  const existing = await getProfileByUserId(userId);
  if (existing) return existing;

  const supabase = await createSupabaseServerClient();
  const memberId = `XYZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;

  const { data, error } = await supabase
    .from("player_profiles")
    .insert({ user_id: userId, member_id: memberId, email })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create player profile.");
  }

  const admin = createSupabaseAdminClient();
  await admin.from("player_statistics").insert({ player_id: data.id });

  return fromRow(data as ProfileRow);
}

export async function updateProfile(
  userId: string,
  updates: Partial<
    Pick<PlayerProfile, "fullName" | "mobile" | "dob" | "city" | "emergencyContact" | "profilePhotoUrl" | "preferredCue">
  >
): Promise<PlayerProfile> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("player_profiles")
    .update({
      full_name: updates.fullName,
      mobile: updates.mobile,
      dob: updates.dob,
      city: updates.city,
      emergency_contact: updates.emergencyContact,
      profile_photo_url: updates.profilePhotoUrl,
      preferred_cue: updates.preferredCue,
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Profile not found");
  }

  return fromRow(data as ProfileRow);
}
