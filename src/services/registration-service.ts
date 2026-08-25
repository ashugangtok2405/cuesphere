import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TOURNAMENTS } from "@/lib/mock/tournaments";
import type { TournamentRegistration } from "@/types/registration";

interface RegistrationRow {
  id: string;
  registration_number: string;
  club_id: string;
  tournament_id: string;
  player_id: string;
  status: TournamentRegistration["status"];
  emergency_contact: string;
  preferred_cue: string;
  notes: string;
  agreed_to_rules: boolean;
  payment_status: TournamentRegistration["paymentStatus"];
  created_at: string;
}

function fromRow(row: RegistrationRow): TournamentRegistration {
  return {
    id: row.id,
    registrationNumber: row.registration_number,
    clubId: row.club_id,
    tournamentId: row.tournament_id,
    playerId: row.player_id,
    status: row.status,
    emergencyContact: row.emergency_contact,
    preferredCue: row.preferred_cue,
    notes: row.notes,
    agreedToRules: row.agreed_to_rules,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}

export function generateRegistrationNumber(tournamentId: string): string {
  const tournament = TOURNAMENTS.find((t) => t.id === tournamentId);
  const year = tournament ? new Date(tournament.startDate).getFullYear() : new Date().getFullYear();
  const sequence = Math.floor(1000 + Math.random() * 8999);
  return `REG-${year}-${sequence}`;
}

export async function getRegistrationForPlayer(
  tournamentId: string,
  playerId: string
): Promise<TournamentRegistration | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_registrations")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId)
    .neq("status", "cancelled")
    .maybeSingle();
  return data ? fromRow(data as RegistrationRow) : undefined;
}

export async function getRegistrationById(id: string): Promise<TournamentRegistration | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("tournament_registrations").select("*").eq("id", id).maybeSingle();
  return data ? fromRow(data as RegistrationRow) : undefined;
}

export async function getRegistrationsForPlayer(
  playerId: string,
  clubId?: string
): Promise<TournamentRegistration[]> {
  const admin = createSupabaseAdminClient();
  let query = admin
    .from("tournament_registrations")
    .select("*")
    .eq("player_id", playerId)
    .neq("status", "cancelled");
  if (clubId) query = query.eq("club_id", clubId);
  const { data } = await query.order("created_at", { ascending: false });
  return (data as RegistrationRow[] | null)?.map(fromRow) ?? [];
}

export async function getRegistrationsForClub(clubId: string): Promise<TournamentRegistration[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_registrations")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });
  return (data as RegistrationRow[] | null)?.map(fromRow) ?? [];
}

export async function getRegistrationsForTournament(
  tournamentId: string
): Promise<TournamentRegistration[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_registrations")
    .select("*")
    .eq("tournament_id", tournamentId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });
  return (data as RegistrationRow[] | null)?.map(fromRow) ?? [];
}

export async function getRegisteredPlayerIds(tournamentId: string): Promise<string[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournament_registrations")
    .select("player_id")
    .eq("tournament_id", tournamentId)
    .neq("status", "cancelled");
  return (data as { player_id: string }[] | null)?.map((r) => r.player_id) ?? [];
}

export async function getRegisteredCount(tournamentId: string): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("tournament_registrations")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId)
    .neq("status", "cancelled");
  return count ?? 0;
}

export async function createRegistration(input: {
  clubId: string;
  tournamentId: string;
  playerId: string;
  emergencyContact: string;
  preferredCue: string;
  notes: string;
  agreedToRules: boolean;
  status: TournamentRegistration["status"];
}): Promise<TournamentRegistration> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournament_registrations")
    .insert({
      registration_number: generateRegistrationNumber(input.tournamentId),
      club_id: input.clubId,
      tournament_id: input.tournamentId,
      player_id: input.playerId,
      status: input.status,
      emergency_contact: input.emergencyContact,
      preferred_cue: input.preferredCue,
      notes: input.notes,
      agreed_to_rules: input.agreedToRules,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create registration.");
  }

  return fromRow(data as RegistrationRow);
}

export async function updateRegistrationPaymentStatus(
  registrationId: string,
  paymentStatus: TournamentRegistration["paymentStatus"]
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tournament_registrations")
    .update({ payment_status: paymentStatus })
    .eq("id", registrationId);
  return { error: error?.message };
}
