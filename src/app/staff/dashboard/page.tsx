import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCaseId, toggleOnboarding } from "./actions";

export default async function CaseIdsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: caseIds } = await supabase
    .from("case_ids")
    .select("id, code, email, phone, onboarding_enabled, is_admin_seed, status, created_at")
    .order("created_at", { ascending: false });

  const { count: sessionCount } = await supabase
    .from("case_sessions")
    .select("id", { count: "exact", head: true });

  const { count: staffCount } = await supabase
    .from("staff_profiles")
    .select("id", { count: "exact", head: true })
    .eq("active", true);

  const total = caseIds?.length ?? 0;
  const enabled = caseIds?.filter((c) => c.onboarding_enabled).length ?? 0;

  return (
    <div>
      <div className="app-topbar">
        <div>
          <h2 style={{ marginBottom: 2 }}>Admin Overview</h2>
          <p className="small" style={{ margin: 0 }}>
            Create Case IDs for beta clients and control whether they see the onboarding questionnaire.
          </p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="label">Total Case IDs</div>
          <div className="val">{total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Onboarding Enabled</div>
          <div className="val">{enabled}</div>
        </div>
        <div className="stat-card">
          <div className="label">Sessions</div>
          <div className="val">{sessionCount ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Staff</div>
          <div className="val">{staffCount ?? 0}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Create a Case ID</h3>
        </div>
        <form action={createCaseId}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="code">Case ID</label>
              <input id="code" name="code" placeholder="e.g. CASE-1029" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email (optional)</label>
              <input id="email" name="email" type="email" placeholder="Email" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" placeholder="Phone" />
            </div>
            <div className="field" style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              <label className="small" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
                <input type="checkbox" name="onboarding_enabled" style={{ width: "auto" }} />
                Onboarding
              </label>
              <label className="small" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
                <input type="checkbox" name="is_admin_seed" style={{ width: "auto" }} />
                Admin seed
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Case ID
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All Case IDs</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Onboarding</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(caseIds ?? []).map((c) => (
              <tr key={c.id}>
                <td>
                  {c.code}
                  {c.is_admin_seed && (
                    <span className="badge badge-admin" style={{ marginLeft: 8 }}>
                      Admin Seed
                    </span>
                  )}
                </td>
                <td className="small">{c.email || c.phone || "—"}</td>
                <td className="small" style={{ textTransform: "capitalize" }}>
                  {c.status}
                </td>
                <td>
                  {c.onboarding_enabled ? (
                    <span className="badge badge-active">Enabled</span>
                  ) : (
                    <span className="badge badge-pending">Disabled</span>
                  )}
                </td>
                <td>
                  <form action={toggleOnboarding.bind(null, c.id, !c.onboarding_enabled)}>
                    <button type="submit" className="small" style={{ background: "none", border: "none", color: "var(--federal-blue)", cursor: "pointer", padding: 0 }}>
                      {c.onboarding_enabled ? "Disable" : "Enable"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!caseIds || caseIds.length === 0) && (
              <tr>
                <td colSpan={5} className="empty-state">
                  No Case IDs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
