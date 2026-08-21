import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "worker";

export type StaffProfile = {
  id: string;
  role: StaffRole;
  display_name: string | null;
  active: boolean;
};

/**
 * Returns the currently signed-in staff member's profile (role-checked via
 * the staff_profiles table + RLS), or null if not signed in / not staff.
 */
export async function getCurrentStaff(): Promise<StaffProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("id, role, display_name, active")
    .eq("auth_user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!profile) return null;

  return profile as StaffProfile;
}
