"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export async function logOutCaseSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CASE_SESSION_COOKIE);
  redirect("/");
}

export async function chooseCategory(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token || !category) {
    redirect("/portal");
  }

  const { data: sessionRows } = await supabase.rpc("get_case_session", { p_token: token });
  const onboardingEnabled = sessionRows?.[0]?.onboarding_enabled ?? false;

  await supabase.rpc("select_case_category", { p_token: token, p_category: category });

  if (onboardingEnabled) {
    redirect("/questionnaire");
  }

  // No questionnaire needed for this case — record the category choice as the
  // submission so review/quote have something to read back.
  await supabase.rpc("submit_onboarding", {
    p_token: token,
    p_responses: { category, answers: {} },
  });

  redirect("/review");
}