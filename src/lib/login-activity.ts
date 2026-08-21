import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function logLoginAttempt(params: {
  success: boolean;
  attemptedIdentifier: string;
  staffId?: string | null;
}) {
  try {
    const admin = createSupabaseAdminClient();
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : headerList.get("x-real-ip");
    const userAgent = headerList.get("user-agent");

    await admin.from("staff_login_activity").insert({
      staff_id: params.staffId ?? null,
      attempted_identifier: params.attemptedIdentifier,
      ip_address: ip ?? null,
      user_agent: userAgent ?? null,
      success: params.success,
    });
  } catch {
    // Best-effort only — a logging failure must never block sign-in.
  }
}