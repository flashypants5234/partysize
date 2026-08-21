"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";
import { recordActivity } from "@/lib/activity";

export async function submitCaseId(formData: FormData) {
  const code = String(formData.get("caseId") ?? "").trim();

  if (!code) {
    redirect("/access?error=1");
  }

  const { data, error } = await supabase.rpc("validate_case_id", { p_code: code });

  if (error || !data || data.length === 0) {
    redirect("/access?error=1");
  }

  const { session_token } = data[0];

  const cookieStore = await cookies();
  cookieStore.set(CASE_SESSION_COOKIE, session_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  await recordActivity(
    { eventType: "login", pagePath: "/access", metadata: { case_code: code } },
    session_token,
  );

  redirect("/portal");
}
