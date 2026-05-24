import { createClient } from "@supabase/supabase-js";

// Admin client with service role — use ONLY on server, never expose to client
// Bypasses RLS for operations like generating signed URLs for any user's files
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase admin credentials");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
