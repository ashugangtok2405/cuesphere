import { createClient } from "@supabase/supabase-js";

/**
 * Elevated-access client that bypasses Row Level Security. Server-only —
 * never import this into a Client Component or expose the secret key to
 * the browser. Used for system-generated writes (notifications, match
 * draws/results, statistics) that a regular authenticated user shouldn't
 * be able to perform directly, even though some are currently triggered
 * from demo buttons standing in for a future admin panel.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
