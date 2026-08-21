"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PANEL_PATH = "/404wrker-panel";

function toDevEmail(identifier: string) {
  return identifier.includes("@") ? identifier : `${identifier}@local.test`;
}

export async function loginWorkerPanel(formData: FormData) {
  const identifier = String(formData.get("email") ?? "").trim();
  const email = toDevEmail(identifier);
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(PANEL_PATH);
}

export async function logoutWorkerPanel() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(PANEL_PATH);
}

async function currentStaffId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();
  return staff?.id ?? null;
}

export async function createCaseId(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const code = `CASE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const staffId = await currentStaffId(supabase);

  const { data: created, error } = await supabase
    .from("case_ids")
    .insert({ code, email, phone, notes, created_by: staffId })
    .select("id")
    .single();

  if (error) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "create_case_id",
    target_case_id: created.id,
  });

  revalidatePath(PANEL_PATH);
}

export async function toggleOnboardingAction(formData: FormData) {
  const caseId = String(formData.get("caseId"));
  const enabled = formData.get("enabled") === "true";
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("case_ids")
    .update({ onboarding_enabled: enabled })
    .eq("id", caseId);

  if (error) return;

  const staffId = await currentStaffId(supabase);
  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: enabled ? "enable_onboarding" : "disable_onboarding",
    target_case_id: caseId,
  });

  revalidatePath(PANEL_PATH);
}