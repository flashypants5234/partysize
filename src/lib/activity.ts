import { cookies, headers } from "next/headers";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

export type ActivityEvent = {
  eventType: string;
  pagePath?: string | null;
  questionKey?: string | null;
  answerValue?: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * Resolves the client IP from proxy headers. A browser cannot be trusted to
 * report its own address, so this is only ever read server-side.
 */
async function resolveClient() {
  const headerList = await headers();

  const forwarded = headerList.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip")?.trim() ||
    null;

  return { ip, userAgent: headerList.get("user-agent") };
}

/**
 * Appends a client action to the per-case activity archive and refreshes the
 * session's live location. Never throws — logging must not break the flow.
 */
export async function recordActivity(event: ActivityEvent, token?: string) {
  try {
    let sessionToken = token;

    if (!sessionToken) {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(CASE_SESSION_COOKIE)?.value;
    }

    if (!sessionToken) return;

    const { ip, userAgent } = await resolveClient();

    await supabase.rpc("log_case_activity", {
      p_token: sessionToken,
      p_event_type: event.eventType,
      p_page_path: event.pagePath ?? null,
      p_question_key: event.questionKey ?? null,
      p_answer_value: event.answerValue ?? null,
      p_metadata: event.metadata ?? {},
      p_ip: ip,
      p_user_agent: userAgent,
    });
  } catch {
    // Activity logging is best-effort and must never interrupt the client.
  }
}
