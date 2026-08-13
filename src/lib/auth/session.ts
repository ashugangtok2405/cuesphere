import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/types/user";

/** Memoized per-request — getSession() is called from dozens of places
 * (pages, layouts, getClubViewer, getViewer) on every navigation. Without
 * this, each call re-hits Supabase's Auth API over the network; with it,
 * the actual auth check runs once per request and every other call reuses
 * that result for free. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
});

export async function destroySession() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
