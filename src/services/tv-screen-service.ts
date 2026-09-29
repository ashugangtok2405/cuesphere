import { randomBytes, randomInt } from "node:crypto";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// No 0/O or 1/I/L: codes are read off a TV across the room.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_TTL_MS = 15 * 60 * 1000;

export interface TvScreen {
  id: string;
  clubId: string | null;
  tableNumber: number | null;
  pairCode: string | null;
  codeExpiresAt: string | null;
  pairedAt: string | null;
  lastSeenAt: string | null;
}

interface TvScreenRow {
  id: string;
  club_id: string | null;
  table_number: number | null;
  pair_code: string | null;
  code_expires_at: string | null;
  paired_at: string | null;
  last_seen_at: string | null;
}

function fromRow(row: TvScreenRow): TvScreen {
  return {
    id: row.id,
    clubId: row.club_id,
    tableNumber: row.table_number,
    pairCode: row.pair_code,
    codeExpiresAt: row.code_expires_at,
    pairedAt: row.paired_at,
    lastSeenAt: row.last_seen_at,
  };
}

function newCode() {
  return Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

/** Normalises what staff type: case-insensitive, ignores spaces and dashes. */
export function cleanPairCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function assignFreshCode(id: string): Promise<{ code: string; expiresAt: string } | null> {
  const admin = createSupabaseAdminClient();
  // Retry on the (rare) chance a random code collides with one already showing.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();
    const { error } = await admin.from("tv_screens").update({ pair_code: code, code_expires_at: expiresAt }).eq("id", id);
    if (!error) return { code, expiresAt };
  }
  return null;
}

/** A TV that isn't paired yet gets an identity and a code to show. */
export async function registerTvScreen(): Promise<{ token: string; code: string; expiresAt: string } | { error: string }> {
  const admin = createSupabaseAdminClient();
  const token = randomBytes(32).toString("base64url");
  const { data, error } = await admin.from("tv_screens").insert({ device_token: token }).select("id").single();
  if (error || !data) return { error: error?.message ?? "Could not register this TV." };
  const code = await assignFreshCode(data.id);
  if (!code) return { error: "Could not create a pairing code." };
  return { token, ...code };
}

/** Looks a TV up by its device token, renewing an expired code and noting it's online. */
export async function checkInTvScreen(token: string): Promise<TvScreen | undefined> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("tv_screens").select("*").eq("device_token", token).maybeSingle();
  if (!data) return undefined;
  const screen = fromRow(data as TvScreenRow);

  const now = new Date().toISOString();
  await admin.from("tv_screens").update({ last_seen_at: now }).eq("id", screen.id);
  screen.lastSeenAt = now;

  if (!screen.clubId && (!screen.codeExpiresAt || Date.parse(screen.codeExpiresAt) < Date.now())) {
    const code = await assignFreshCode(screen.id);
    if (code) {
      screen.pairCode = code.code;
      screen.codeExpiresAt = code.expiresAt;
    }
  }
  return screen;
}

export async function pairTvScreen(clubId: string, code: string, tableNumber: number): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tv_screens")
    .select("id, code_expires_at, club_id")
    .eq("pair_code", cleanPairCode(code))
    .maybeSingle();
  if (!data || data.club_id) return { error: "That code isn't showing on any TV. Check the code on the screen." };
  if (!data.code_expires_at || Date.parse(data.code_expires_at) < Date.now()) {
    return { error: "That code has expired. The TV now shows a new one." };
  }

  const { error } = await admin
    .from("tv_screens")
    .update({
      club_id: clubId,
      table_number: tableNumber,
      paired_at: new Date().toISOString(),
      pair_code: null,
      code_expires_at: null,
    })
    .eq("id", data.id);
  return { error: error?.message };
}

export async function listTvScreensForClub(clubId: string): Promise<TvScreen[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tv_screens")
    .select("*")
    .eq("club_id", clubId)
    .order("table_number", { ascending: true });
  return (data as TvScreenRow[] | null)?.map(fromRow) ?? [];
}

export async function moveTvScreen(clubId: string, id: string, tableNumber: number): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("tv_screens").update({ table_number: tableNumber }).eq("id", id).eq("club_id", clubId);
  return { error: error?.message };
}

/** Unpairing sends the TV back to its pairing-code screen. */
export async function unpairTvScreen(clubId: string, id: string): Promise<{ error?: string }> {
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("tv_screens")
    .update({ club_id: null, table_number: null, paired_at: null })
    .eq("id", id)
    .eq("club_id", clubId);
  return { error: error?.message };
}
