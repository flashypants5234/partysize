import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  loginWorkerPanel,
  logoutWorkerPanel,
  createCaseId,
  updateCaseDetails,
  toggleOnboardingAction,
} from "./actions";

type CaseSessionRow = {
  id: string;
  current_step: string;
  started_at: string;
  last_activity_at: string;
  case_ids: { code: string; email: string | null } | { code: string; email: string | null }[] | null;
};

export default async function WorkerPanelPage({
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
            <h1>Worker Sign In</h1>
            {error && (
              <p className="form-note" style={{ color: "#B3261E" }}>
                {error}
              </p>
            )}
            <form action={loginWorkerPanel} className="form-card">
              <div className="field">
                <label htmlFor="email">Username</label>
                <input id="email" name="email" type="text" required placeholder="worker" />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required placeholder="temp" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>
              <p className="form-note">Dev login: worker / temp</p>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const { data: role } = await supabase.rpc("current_staff_role");

  if (role !== "worker" && role !== "admin") {
    return (
      <main className="as-skin">
        <section className="section">
          <div className="container" style={{ maxWidth: 420 }}>
            <h1>Not Authorized</h1>
            <p>This account does not have worker access.</p>
            <form action={logoutWorkerPanel}>
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
      "id, code, email, onboarding_enabled, status, specialist_name, protected_party_name, case_overview, client_status, notes, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: sessions } = await supabase
    .from("case_sessions")
    .select("id, current_step, started_at, last_activity_at, case_ids(code, email)")
    .order("last_activity_at", { ascending: false })
    .limit(30);

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
            <h1>Worker Dashboard</h1>
            <form action={logoutWorkerPanel}>
              <button type="submit" className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </form>
          </div>

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
        </div>
      </section>
    </main>
  );
}