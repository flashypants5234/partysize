import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mxholbwepyzurhykoinx.supabase.co";

export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it as an environment variable to create worker accounts."
    );
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}