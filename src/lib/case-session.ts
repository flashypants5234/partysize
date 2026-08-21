import { cookies } from "next/headers";
import { supabase } from "@/integrations/supabase/client";

export const CASE_SESSION_COOKIE = "case_session_token";

export type CaseSessionStatus = {
  onboarding_enabled: boolean;
  current_step: "logged_in" | "onboarding_in_progress" | "onboarding_completed" | "in_portal";
};

/** Reads the case session cookie (if any) and validates it against the database. */
export async function getCaseSession(): Promise<CaseSessionStatus | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;
  if (!token) return null;

  const { data, error } = await supabase.rpc("get_case_session", { p_token: token });
  if (error || !data || data.length === 0) return null;

  return data[0] as CaseSessionStatus;
}
