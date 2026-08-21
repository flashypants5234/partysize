"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/rate-limit";
import { logLoginAttempt } from "@/lib/login-activity";

const PANEL_PATH = "/808admin-panel";
const TEXT_ACTIONS = ["create_case_id", "update_case_details", "add_worker_note"];

function toDevEmail(identifier: string) {
  return identifier.includes("@") ? identifier : `${identifier}@local.test`;
}

export async function loginAdminPanel(formData: FormData) {
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
  const assignedStaffId = String(formData.get("assignedStaffId") ?? "").trim() || staffId;
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
      assigned_staff_id: assignedStaffId,
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
    redirect(`/808admin-panel/case/${id}?error=${encodeURIComponent("You're doing that too fast. Wait a few seconds and try again.")}`);
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
    redirect(`/808admin-panel/case/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "update_case_details",
    target_case_id: id,
  });

  revalidatePath(`/808admin-panel/case/${id}`);
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

  revalidatePath(`/808admin-panel/case/${caseId}`);
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
    redirect(`/808admin-panel/case/${caseId}`);
  }

  if (await isRateLimited(supabase, staffId, TEXT_ACTIONS)) {
    redirect(`/808admin-panel/case/${caseId}?error=${encodeURIComponent("You're doing that too fast. Wait a few seconds and try again.")}`);
  }

  const { error } = await supabase.from("worker_case_notes").insert({ case_id: caseId, staff_id: staffId, note });

  if (error) {
    redirect(`/808admin-panel/case/${caseId}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    staff_id: staffId,
    action: "add_worker_note",
    target_case_id: caseId,
  });

  revalidatePath(`/808admin-panel/case/${caseId}`);
}

export async function issueQuote(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const staffId = await currentStaffId(supabase);
  const caseId = String(formData.get("caseId"));

  if (!staffId) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  const quoteText = String(formData.get("quoteText") ?? "").trim();
  if (!quoteText) {
    redirect(`/808admin-panel/case/${caseId}?error=${encodeURIComponent("Quote text cannot be empty")}`);
  }

  const { error } = await supabase.from("case_quotes").upsert(
    {
      case_id: caseId,
      quote_text: quoteText,
      issued_at: new Date().toISOString(),
      issued_by: staffId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "case_id" }
  );

  if (error) {
    redirect(`/808admin-panel/case/${caseId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/808admin-panel/case/${caseId}`);
  revalidatePath(PANEL_PATH);
}

export async function savePreset(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const staffId = await currentStaffId(supabase);
  if (!staffId) {
    redirect(`${PANEL_PATH}?error=${encodeURIComponent("Not authorized")}`);
  }

  const { count } = await supabase.from("quote_presets").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= 25) {
    redirect(
      `/808admin-panel/presets?error=${encodeURIComponent("You've reached the 25 preset limit. Delete one before adding another.")}`
    );
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const quoteText = String(formData.get("quoteText") ?? "").trim();

  if (!title || !quoteText) {
    redirect(`/808admin-panel/presets?error=${encodeURIComponent("Title and quote text are required")}`);
  }

  const { error } = await supabase.from("quote_presets").insert({ title, description, quote_text: quoteText });

  if (error) {
    redirect(`/808admin-panel/presets?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/808admin-panel/presets");
}

export async function deletePreset(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id"));
  // Intentionally no audit log entry — presets are secret to admin.
  await supabase.from("quote_presets").delete().eq("id", id);
  revalidatePath("/808admin-panel/presets");
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

export async function banWorker(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id"));
  await supabase.from("staff_profiles").update({ banned: true, active: false }).eq("id", id);
  revalidatePath(PANEL_PATH);
}

export async function unbanWorker(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id"));
  await supabase.from("staff_profiles").update({ banned: false, active: true }).eq("id", id);
  revalidatePath(PANEL_PATH);
}