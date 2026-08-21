"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentStaff } from "@/lib/staff-auth";

export async function createCaseId(formData: FormData) {
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("Not signed in");

  const code = String(formData.get("code") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const onboardingEnabled = formData.get("onboarding_enabled") === "on";
  const isAdminSeed = formData.get("is_admin_seed") === "on";

  if (!code) throw new Error("Case ID code is required");

  const supabase = await createSupabaseServerClient();

  const { data: created, error } = await supabase
    .from("case_ids")
    .insert({
      code,
      email,
      phone,
      onboarding_enabled: onboardingEnabled,
      is_admin_seed: isAdminSeed,
      created_by: staff.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    staff_id: staff.id,
    action: "create_case_id",
    target_case_id: created.id,
    metadata: { code },
  });

  revalidatePath("/staff/dashboard");
}

export async function toggleOnboarding(caseId: string, enabled: boolean) {
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("Not signed in");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("case_ids")
    .update({ onboarding_enabled: enabled })
    .eq("id", caseId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    staff_id: staff.id,
    action: enabled ? "enable_onboarding" : "disable_onboarding",
    target_case_id: caseId,
  });

  revalidatePath("/staff/dashboard");
}

export async function createWorkerAccount(formData: FormData) {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") throw new Error("Admin only");

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim() || null;

  if (!username || !password) throw new Error("Username and password are required");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.functions.invoke("create-worker", {
    body: {
      email: `${username}@internal.beta`,
      password,
      role: "worker",
      display_name: displayName,
    },
  });

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    staff_id: staff.id,
    action: "create_worker",
    metadata: { username },
  });

  revalidatePath("/staff/dashboard/workers");
}

export async function deactivateWorker(staffProfileId: string) {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") throw new Error("Admin only");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("staff_profiles")
    .update({ active: false })
    .eq("id", staffProfileId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    staff_id: staff.id,
    action: "deactivate_worker",
    metadata: { staff_profile_id: staffProfileId },
  });

  revalidatePath("/staff/dashboard/workers");
}
