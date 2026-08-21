"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export async function confirmReview() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/access");
  }

  await supabase.rpc("update_case_step", { p_token: token, p_step: "quote_requested" });
  await supabase.rpc("request_quote", { p_token: token });

  redirect("/quote");
}