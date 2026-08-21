import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://mxholbwepyzurhykoinx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oRW5ZFLbdMrLAQN5qV_86Q_D8A8bRmF";

/**
 * Server-side Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads/writes the Supabase auth session via cookies so
 * Row Level Security policies apply based on the signed-in staff member.
 */
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
          // Called from a Server Component without mutation rights; safe to ignore
          // because middleware refreshes the session on every request.
        }
      },
    },
  });
}
