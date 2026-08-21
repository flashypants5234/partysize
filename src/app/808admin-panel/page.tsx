import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  loginAdminPanel,
  logoutAdminPanel,
  createCaseId,
  updateCaseDetails,
  toggleOnboardingAction,
  createAdminSeed,
  createWorkerAccount,
  deactivateWorker,
} from "./actions";

type CaseSessionRow = {
  id: string;
  current_step: string;
  started_at: string;
  last_activity_at: string;
  case_ids: { code: string; email: string | null } | { code: string; email: string | null }[] | null;
};

export default async function AdminPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="as-skin">
        <section className="section">
          <div className="container" style={{ maxWidth: 420 }}>
            <h1>Admin Sign In</h1>
            {error && (
              <p className="form-note" style={{ color: "#B3261E" }}>
                {error}
              </p>
            )}
            <form action={loginAdminPanel} className="form-card">
              <div className="field">
                <label htmlFor="email">Username</label>
                <input id="email" name="email" type="text" required placeholder="admin" />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required placeholder="temp" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>
              <p className="form-note">Dev login: admin / temp</p>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const { data: role } = await supabase.rpc("current_staff_role");

  if (role !== "admin") {
    return (
      <main className="as-skin">
        <section className="section">
          <div className="container" style={{ maxWidth: 420 }}>
            <h1>Not Authorized</h1>
            <p>This account does not have admin access.</p>
            <form action={logoutAdminPanel}>
              <button type="submit" className="btn btn-outline">
                Sign Out
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const { data: caseIds } = await supabase
    .from("case_ids")
    .select(
      "id, code, email, onboarding_enabled, status, is_admin_seed, specialist_name, protected_party_name, case_overview, client_status, notes, created_at"
    )
    .eq("is_admin_seed", false)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: adminSeeds } = await supabase
    .from("case_ids")
    .select("id, code, status, notes, created_at")
    .eq("is_admin_seed", true)
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: sessions } = await supabase
    .from("case_sessions")
    .select("id, current_step, started_at, last_activity_at, case_ids(code, email)")
    .order("last_activity_at", { ascending: false })
    .limit(30);

  const { data: workers } = await supabase
    .from("staff_profiles")
    .select("id, display_name, role, active, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="as-skin">
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h1>Admin Dashboard</h1>
            <form action={logoutAdminPanel}>
              <button type="submit" className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </form>
          </div>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Create Case ID</h2>
            <form action={createCaseId} className="field-row">
              <div className="field">
                <label htmlFor="email">Client Email (optional)</label>
                <input id="email" name="email" type="email" />
              </div>
              <div className="field">
                <label htmlFor="phone">Client Phone (optional)</label>
                <input id="phone" name="phone" type="text" />
              </div>
              <div className="field">
                <label htmlFor="specialistName">Assigned Specialist (optional)</label>
                <input id="specialistName" name="specialistName" type="text" />
              </div>
              <div className="field">
                <label htmlFor="protectedPartyName">Protected Party (optional)</label>
                <input id="protectedPartyName" name="protectedPartyName" type="text" />
              </div>
              <div className="field">
                <label htmlFor="caseOverview">Case Overview (optional)</label>
                <input id="caseOverview" name="caseOverview" type="text" />
              </div>
              <div className="field">
                <label htmlFor="notes">Case Notes (optional)</label>
                <input id="notes" name="notes" type="text" />
              </div>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Case IDs</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Onboarding</th>
                  <th>Specialist</th>
                  <th>Protected Party</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {(caseIds ?? []).map((c) => (
                  <tr key={c.id}>
                    <td>{c.code}</td>
                    <td>{c.email ?? "—"}</td>
                    <td>
                      <span className="badge badge-active">{c.client_status ?? "Active"}</span>
                    </td>
                    <td>
                      <form action={toggleOnboardingAction}>
                        <input type="hidden" name="caseId" value={c.id} />
                        <input type="hidden" name="enabled" value={(!c.onboarding_enabled).toString()} />
                        <button type="submit" className="btn btn-outline btn-sm">
                          {c.onboarding_enabled ? "Disable" : "Enable"}
                        </button>
                      </form>
                    </td>
                    <td>{c.specialist_name ?? "—"}</td>
                    <td>{c.protected_party_name ?? "—"}</td>
                    <td>
                      <details>
                        <summary className="small" style={{ cursor: "pointer" }}>
                          Edit
                        </summary>
                        <form action={updateCaseDetails} style={{ marginTop: 10, minWidth: 240 }}>
                          <input type="hidden" name="caseId" value={c.id} />
                          <div className="field">
                            <label>Specialist name</label>
                            <input name="specialistName" type="text" defaultValue={c.specialist_name ?? ""} />
                          </div>
                          <div className="field">
                            <label>Protected party</label>
                            <input
                              name="protectedPartyName"
                              type="text"
                              defaultValue={c.protected_party_name ?? ""}
                            />
                          </div>
                          <div className="field">
                            <label>Case overview</label>
                            <textarea name="caseOverview" rows={2} defaultValue={c.case_overview ?? ""} />
                          </div>
                          <div className="field">
                            <label>Case notes</label>
                            <textarea name="notes" rows={2} defaultValue={c.notes ?? ""} />
                          </div>
                          <div className="field">
                            <label>Client-facing status</label>
                            <input name="clientStatus" type="text" defaultValue={c.client_status ?? "Active"} />
                          </div>
                          <button type="submit" className="btn btn-primary btn-sm">
                            Save
                          </button>
                        </form>
                      </details>
                    </td>
                  </tr>
                ))}
                {(!caseIds || caseIds.length === 0) && (
                  <tr>
                    <td colSpan={7}>No case IDs yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Active Sessions</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Step</th>
                  <th>Started</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {(sessions as CaseSessionRow[] | null ?? []).map((s) => {
                  const info = Array.isArray(s.case_ids) ? s.case_ids[0] : s.case_ids;
                  return (
                    <tr key={s.id}>
                      <td>{info?.code ?? "—"}</td>
                      <td>{s.current_step}</td>
                      <td>{new Date(s.started_at).toLocaleString()}</td>
                      <td>{new Date(s.last_activity_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
                {(!sessions || sessions.length === 0) && (
                  <tr>
                    <td colSpan={4}>No sessions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Workers</h2>
            <form action={createWorkerAccount} className="field-row">
              <div className="field">
                <label htmlFor="w-email">Username or Email</label>
                <input id="w-email" name="email" type="text" required placeholder="worker or worker@example.com" />
              </div>
              <div className="field">
                <label htmlFor="w-password">Temporary Password</label>
                <input id="w-password" name="password" type="password" required />
              </div>
              <div className="field">
                <label htmlFor="w-name">Display Name</label>
                <input id="w-name" name="displayName" type="text" />
              </div>
              <div className="field">
                <label htmlFor="w-role">Role</label>
                <select id="w-role" name="role" defaultValue="worker">
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
            </form>

            <table className="table" style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(workers ?? []).map((w) => (
                  <tr key={w.id}>
                    <td>{w.display_name ?? "—"}</td>
                    <td>{w.role}</td>
                    <td>
                      <span className={`badge ${w.active ? "badge-success" : "badge-muted"}`}>
                        {w.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {w.active && (
                        <form action={deactivateWorker}>
                          <input type="hidden" name="id" value={w.id} />
                          <button type="submit" className="btn btn-outline btn-sm">
                            Deactivate
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {(!workers || workers.length === 0) && (
                  <tr>
                    <td colSpan={4}>No worker accounts yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Admin Seeds</h2>
            <form action={createAdminSeed} className="field-row">
              <div className="field">
                <label htmlFor="seed-notes">Notes (optional)</label>
                <input id="seed-notes" name="notes" type="text" />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Seed
              </button>
            </form>

            <table className="table" style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {(adminSeeds ?? []).map((s) => (
                  <tr key={s.id}>
                    <td>{s.code}</td>
                    <td>{s.status}</td>
                    <td>{s.notes ?? "—"}</td>
                  </tr>
                ))}
                {(!adminSeeds || adminSeeds.length === 0) && (
                  <tr>
                    <td colSpan={3}>No admin seeds yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}