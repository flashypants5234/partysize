import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://mxholbwepyzurhykoinx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oRW5ZFLbdMrLAQN5qV_86Q_D8A8bRmF";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore when called from a context without a mutable cookie jar.
        }
      },
    },
  });
}