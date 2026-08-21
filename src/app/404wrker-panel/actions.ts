"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";
import { logLoginAttempt } from "@/lib/login-activity";

const PANEL_PATH = "/404wrker-panel";
const TEXT_ACTIONS = ["create_case_id", "update_case_details", "add_worker_note"];

function toDevEmail(identifier: string) {
  return identifier.includes("@") ? identifier : `${identifier}@local.test`;
}

export async function loginWorkerPanel(formData: FormData) {
  const identifier = String(formData.get("email") ?? "").trim();
  const email = toDevEmail(identifier);
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    await logLoginAttempt({ success: false, attemptedIdentifier: identifier });
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error?.message ?? "Sign in failed")}`);
  }

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  await logLoginAttempt({ success: true, attemptedIdentifier: identifier, staffId: staff?.id ?? null });

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
  const staffId = await currentStaffId(supabase);
  if (!staffId) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  if (await isRateLimited(supabase, staffId, TEXT_ACTIONS)) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("You're doing that too fast. Wait a few seconds and try again.")}`);
  }

  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const specialistName = String(formData.get("specialistName") ?? "").trim() || null;
  const protectedPartyName = String(formData.get("protectedPartyName") ?? "").trim() || null;
  const caseOverview = String(formData.get("caseOverview") ?? "").trim() || null;
  const code = `CASE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { data: created, error } = await supabase
    .from("case_ids")
    .insert({
      code,
      email,
      phone,
      notes,
      specialist_name: specialistName,
      protected_party_name: protectedPartyName,
      case_overview: caseOverview,
      created_by: staffId,
      assigned_staff_id: staffId,
    })
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

export async function updateCaseDetails(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const staffId = await currentStaffId(supabase);
  const id = String(formData.get("caseId"));

  if (!staffId) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  if (await isRateLimited(supabase, staffId, TEXT_ACTIONS)) {
    redirect(`/404wrker-panel/case/${id}?error=${encodeURIComponent("You're doing that too fast. Wait a few seconds and try again.")}`);
  }

  const specialistName = String(formData.get("specialistName") ?? "").trim() || null;
  const protectedPartyName = String(formData.get("protectedPartyName") ?? "").trim() || null;
  const caseOverview = String(formData.get("caseOverview") ?? "").trim() || null;
  const clientStatus = String(formData.get("clientStatus") ?? "Active").trim() || "Active";
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const { error } = await supabase
    .from("case_ids")
    .update({
      specialist_name: specialistName,
      protected_party_name: protectedPartyName,
      case_overview: caseOverview,
      client_status: clientStatus,
      notes,
    })
    .eq("id", id);

  if (error) {
    redirect(`/404wrker-panel/case/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "update_case_details",
    target_case_id: id,
  });

  revalidatePath(`/404wrker-panel/case/${id}`);
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

  revalidatePath(`/404wrker-panel/case/${caseId}`);
  revalidatePath(PANEL_PATH);
}

export async function addWorkerNote(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const staffId = await currentStaffId(supabase);
  const caseId = String(formData.get("caseId"));

  if (!staffId) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  const note = String(formData.get("note") ?? "").trim();
  if (!note) {
    redirect(`/404wrker-panel/case/${caseId}`);
  }

  if (await isRateLimited(supabase, staffId, TEXT_ACTIONS)) {
    redirect(`/404wrker-panel/case/${caseId}?error=${encodeURIComponent("You're doing that too fast. Wait a few seconds and try again.")}`);
  }

  const { error } = await supabase.from("worker_case_notes").insert({ case_id: caseId, staff_id: staffId, note });

  if (error) {
    redirect(`/404wrker-panel/case/${caseId}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "add_worker_note",
    target_case_id: caseId,
  });

  revalidatePath(`/404wrker-panel/case/${caseId}`);
}