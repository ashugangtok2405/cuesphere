import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ClubTournament, PrizeBreakdownItem } from "@/types/club-tournament";

interface ClubTournamentRow {
  id: string;
  club_id: string;
  slug: string;
  name: string;
  description: string;
  status: ClubTournament["status"];
  start_date: string | null;
  end_date: string | null;
  location: string;
  prize_pool: string;
  entry_fee: string;
  format: string;
  best_of: number;
  max_players: number;
  registration_open: boolean;
  image_url: string;
  prize_breakdown: PrizeBreakdownItem[];
  champion_id: string | null;
  runner_up_id: string | null;
  created_at: string;
}

function fromRow(row: ClubTournamentRow): ClubTournament {
  return {
    id: row.id,
    clubId: row.club_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    prizePool: row.prize_pool,
    entryFee: row.entry_fee,
    format: row.format,
    bestOf: row.best_of,
    maxPlayers: row.max_players,
    registrationOpen: row.registration_open,
    imageUrl: row.image_url,
    prizeBreakdown: row.prize_breakdown ?? [],
    championId: row.champion_id,
    runnerUpId: row.runner_up_id,
    createdAt: row.created_at,
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listClubTournaments(clubId: string): Promise<ClubTournament[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournaments")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });
  return (data as ClubTournamentRow[] | null)?.map(fromRow) ?? [];
}

export async function getClubTournamentBySlug(
  clubId: string,
  slug: string
): Promise<ClubTournament | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tournaments")
    .select("*")
    .eq("club_id", clubId)
    .eq("slug", slug)
    .maybeSingle();
  return data ? fromRow(data as ClubTournamentRow) : undefined;
}

export async function createClubTournament(input: {
  clubId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  prizePool?: string;
  entryFee?: string;
  format?: string;
  bestOf?: number;
  maxPlayers?: number;
  prizeBreakdown?: PrizeBreakdownItem[];
}): Promise<{ tournament: ClubTournament } | { error: string }> {
  const baseSlug = slugify(input.name);
  if (!baseSlug) return { error: "Enter a tournament name." };

  const admin = createSupabaseAdminClient();
  let slug = baseSlug;
  for (let i = 0; i < 20; i++) {
    const { data: existing } = await admin
      .from("tournaments")
      .select("id")
      .eq("club_id", input.clubId)
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${i + 2}`;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .insert({
      club_id: input.clubId,
      slug,
      name: input.name,
      description: input.description ?? "",
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      location: input.location ?? "",
      prize_pool: input.prizePool ?? "",
      entry_fee: input.entryFee ?? "",
      format: input.format ?? "Knockout",
      best_of: input.bestOf ?? 7,
      max_players: input.maxPlayers ?? 32,
      prize_breakdown: input.prizeBreakdown ?? [],
    })
    .select("*")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create tournament." };
  }

  return { tournament: fromRow(data as ClubTournamentRow) };
}

export async function updateClubTournamentImage(
  tournamentId: string,
  imageUrl: string
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("tournaments").update({ image_url: imageUrl }).eq("id", tournamentId);
}

export async function getClubTournamentById(
  tournamentId: string
): Promise<ClubTournament | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("tournaments").select("*").eq("id", tournamentId).maybeSingle();
  return data ? fromRow(data as ClubTournamentRow) : undefined;
}

export async function updateClubTournament(
  tournamentId: string,
  input: {
    name?: string;
    description?: string;
    status?: ClubTournament["status"];
    startDate?: string;
    endDate?: string;
    location?: string;
    prizePool?: string;
    entryFee?: string;
    format?: string;
    bestOf?: number;
    maxPlayers?: number;
    registrationOpen?: boolean;
    prizeBreakdown?: PrizeBreakdownItem[];
    championId?: string | null;
    runnerUpId?: string | null;
  }
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tournaments")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startDate !== undefined ? { start_date: input.startDate || null } : {}),
      ...(input.endDate !== undefined ? { end_date: input.endDate || null } : {}),
      ...(input.location !== undefined ? { location: input.location } : {}),
      ...(input.prizePool !== undefined ? { prize_pool: input.prizePool } : {}),
      ...(input.entryFee !== undefined ? { entry_fee: input.entryFee } : {}),
      ...(input.format !== undefined ? { format: input.format } : {}),
      ...(input.bestOf !== undefined ? { best_of: input.bestOf } : {}),
      ...(input.maxPlayers !== undefined ? { max_players: input.maxPlayers } : {}),
      ...(input.registrationOpen !== undefined ? { registration_open: input.registrationOpen } : {}),
      ...(input.prizeBreakdown !== undefined ? { prize_breakdown: input.prizeBreakdown } : {}),
      ...(input.championId !== undefined ? { champion_id: input.championId } : {}),
      ...(input.runnerUpId !== undefined ? { runner_up_id: input.runnerUpId } : {}),
    })
    .eq("id", tournamentId);
  return { error: error?.message };
}

export async function deleteClubTournament(tournamentId: string): Promise<void> {
  const admin = createSupabaseAdminClient();

  const { data: registrations } = await admin
    .from("tournament_registrations")
    .select("id")
    .eq("tournament_id", tournamentId);
  const registrationIds = registrations?.map((r) => r.id) ?? [];

  if (registrationIds.length > 0) {
    await admin.from("payments").delete().in("registration_id", registrationIds);
  }
  await admin.from("tournament_registrations").delete().eq("tournament_id", tournamentId);
  await admin.from("matches").delete().eq("tournament_id", tournamentId);

  const supabase = await createSupabaseServerClient();
  await supabase.from("tournaments").delete().eq("id", tournamentId);
}

export async function countRegisteredForClubTournament(tournamentId: string): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("tournament_registrations")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId)
    .neq("status", "cancelled");
  return count ?? 0;
}
