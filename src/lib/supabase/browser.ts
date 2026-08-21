"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://mxholbwepyzurhykoinx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oRW5ZFLbdMrLAQN5qV_86Q_D8A8bRmF";

/**
 * Browser Supabase client that stores the auth session in cookies (not
 * localStorage), so the staff portal's server components/middleware can
 * read the same session.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
