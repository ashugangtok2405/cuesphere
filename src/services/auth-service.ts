import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUp(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account." };
  return {
    userId: data.user.id,
    email: data.user.email ?? email,
    needsEmailConfirmation: !data.session,
  };
}

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };
  if (!data.user) return { error: "Incorrect email or password." };
  return { userId: data.user.id, email: data.user.email ?? email };
}
