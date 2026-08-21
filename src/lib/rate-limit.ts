import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/**
 * Returns true if the given staff member has performed too many of the given
 * actions in the recent window. Intended only for actions involving text
 * input or uploads — not for quick toggles or reads.
 */
export async function isRateLimited(
  supabase: SupabaseServerClient,
  staffId: string,
  actions: string[],
  options: { limit?: number; windowSeconds?: number } = {}
): Promise<boolean> {
  const { limit = 8, windowSeconds = 10 } = options;
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count } = await supabase
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .eq("staff_id", staffId)
    .in("action", actions)
    .gte("created_at", since);

  return (count ?? 0) >= limit;
}