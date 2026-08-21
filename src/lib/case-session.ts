import { cookies } from "next/headers";
import { supabase } from "@/integrations/supabase/client";

export const CASE_SESSION_COOKIE = "case_session_token";

export type CaseSessionStatus = {
  onboarding_enabled: boolean;
  current_step: string;
  selected_category: string | null;
  case_code: string;
  specialist_name: string | null;
  protected_party_name: string | null;
  case_overview: string | null;
  client_status: string;
  case_notes: string | null;
  responses: { category?: string; answers?: Record<string, string> } | null;
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