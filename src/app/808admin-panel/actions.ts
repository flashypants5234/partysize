"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const PANEL_PATH = "/808admin-panel";

function toDevEmail(identifier: string) {
  return identifier.includes("@") ? identifier : `${identifier}@local.test`;
}

export async function loginAdminPanel(formData: FormData) {
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

export async function logoutAdminPanel() {
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
  const specialistName = String(formData.get("specialistName") ?? "").trim() || null;
  const protectedPartyName = String(formData.get("protectedPartyName") ?? "").trim() || null;
  const caseOverview = String(formData.get("caseOverview") ?? "").trim() || null;
  const code = `CASE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const staffId = await currentStaffId(supabase);

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
  const id = String(formData.get("caseId"));
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
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  const staffId = await currentStaffId(supabase);
  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "update_case_details",
    target_case_id: id,
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

export async function createAdminSeed(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const code = `SEED-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const staffId = await currentStaffId(supabase);

  const { data: created, error } = await supabase
    .from("case_ids")
    .insert({ code, notes, is_admin_seed: true, created_by: staffId })
    .select("id")
    .single();

  if (error) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "create_admin_seed",
    target_case_id: created.id,
  });

  revalidatePath(PANEL_PATH);
}

export async function createWorkerAccount(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: roleData } = await supabase.rpc("current_staff_role");

  if (roleData !== "admin") {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  const identifier = String(formData.get("email") ?? "").trim();
  const email = toDevEmail(identifier);
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim() || null;
  const role = String(formData.get("role") ?? "worker");

  let admin;
  try {
    admin = createSupabaseAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server not configured";
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(message)}`);
  }

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !created?.user) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent(error?.message ?? "Failed to create account")}`);
  }

  const staffId = await currentStaffId(supabase);

  await supabase.from("staff_profiles").insert({
    auth_user_id: created.user.id,
    role,
    display_name: displayName,
    created_by: staffId,
  });

  revalidatePath(PANEL_PATH);
}

export async function deactivateWorker(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id"));

  await supabase.from("staff_profiles").update({ active: false }).eq("id", id);

  revalidatePath(PANEL_PATH);
}