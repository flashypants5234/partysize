"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export async function submitQuestionnaire(category: string, answers: Record<string, string>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/access");
  }

  await supabase.rpc("submit_onboarding", {
    p_token: token,
    p_responses: { category, answers },
  });

  redirect("/review");
}