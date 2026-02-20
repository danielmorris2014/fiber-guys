import { createClient } from "@supabase/supabase-js";

/**
 * Supabase server client — used in Server Actions and API routes.
 *
 * Required env vars:
 *   SUPABASE_URL          — Project URL (e.g. https://xyz.supabase.co)
 *   SUPABASE_SERVICE_KEY   — Service role key (server-side only, never expose to client)
 *
 * The service key bypasses RLS so we can insert leads from the server action.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
