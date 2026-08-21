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
      <div className="app-topbar">
        <div>
          <h2 style={{ marginBottom: 2 }}>Session Activity</h2>
          <p className="small" style={{ margin: 0 }}>
            {isAdmin
              ? "Full visibility into beta client sessions."
              : "Contact details are masked and admin-seed cases are excluded from this view."}
          </p>
        </div>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Case</th>
              <th>Contact</th>
              <th>Step</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {(sessions ?? []).map((s) => {
              const caseInfo = Array.isArray(s.case_ids) ? s.case_ids[0] : s.case_ids;
              return (
                <tr key={s.id}>
                  <td>
                    {caseInfo?.code ?? "—"}
                    {caseInfo?.is_admin_seed && (
                      <span className="badge badge-admin" style={{ marginLeft: 8 }}>
                        Admin Seed
                      </span>
                    )}
                  </td>
                  <td className="small">
                    {isAdmin
                      ? caseInfo?.email || caseInfo?.phone || "—"
                      : caseInfo?.email
                      ? maskEmail(caseInfo.email)
                      : maskPhone(caseInfo?.phone ?? null)}
                  </td>
                  <td className="small">{stepLabels[s.current_step] ?? s.current_step}</td>
                  <td className="small">{new Date(s.last_activity_at).toLocaleString()}</td>
                </tr>
              );
            })}
            {(!sessions || sessions.length === 0) && (
              <tr>
                <td colSpan={4} className="empty-state">
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
