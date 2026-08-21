"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export async function markOnboardingInProgress() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;
  if (!token) return;
  await supabase.rpc("update_case_step", { p_token: token, p_step: "onboarding_in_progress" });
}

export async function submitOnboardingResponses(responses: Record<string, unknown>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/access");
  }

  const { data, error } = await supabase.rpc("submit_onboarding", {
    p_token: token,
    p_responses: responses,
  });

  if (error || !data) {
    redirect("/access?error=1");
  }

  redirect("/portal");
}
