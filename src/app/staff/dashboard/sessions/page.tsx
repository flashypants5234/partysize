import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentStaff } from "@/lib/staff-auth";

function maskEmail(email: string | null) {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return "•••";
  return `${name.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string | null) {
  if (!phone) return "—";
  return `•••${phone.slice(-2)}`;
}

const stepLabels: Record<string, string> = {
  logged_in: "Logged in",
  onboarding_in_progress: "Onboarding in progress",
  onboarding_completed: "Onboarding completed",
  in_portal: "In portal",
};

export default async function SessionsPage() {
  const staff = await getCurrentStaff();
  const supabase = await createSupabaseServerClient();

  const { data: sessions } = await supabase
    .from("case_sessions")
    .select(
      "id, current_step, started_at, last_activity_at, case_ids(code, email, phone, is_admin_seed)"
    )
    .order("last_activity_at", { ascending: false });

  const isAdmin = staff?.role === "admin";

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Session Activity</h1>
      <p className="mt-1 text-sm text-slate-500">
        {isAdmin
          ? "Full visibility into beta client sessions."
          : "Contact details are masked and admin-seed cases are excluded from this view."}
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Step</th>
              <th className="px-4 py-3">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(sessions ?? []).map((s) => {
              const caseInfo = Array.isArray(s.case_ids) ? s.case_ids[0] : s.case_ids;
              return (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {caseInfo?.code ?? "—"}
                    {caseInfo?.is_admin_seed && (
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                        Admin Seed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {isAdmin
                      ? caseInfo?.email || caseInfo?.phone || "—"
                      : caseInfo?.email
                      ? maskEmail(caseInfo.email)
                      : maskPhone(caseInfo?.phone ?? null)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {stepLabels[s.current_step] ?? s.current_step}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(s.last_activity_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {(!sessions || sessions.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
