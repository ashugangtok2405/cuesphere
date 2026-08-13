import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/types/user";

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
}

export async function destroySession() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
