import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  loginAdminPanel,
  logoutAdminPanel,
  createCaseId,
  toggleOnboardingAction,
  createAdminSeed,
  createWorkerAccount,
  deactivateWorker,
  banWorker,
  unbanWorker,
} from "./actions";

type CaseSessionRow = {
  id: string;
  current_step: string;
  started_at: string;
  last_activity_at: string;
  case_ids: { code: string; email: string | null } | { code: string; email: string | null }[] | null;
};

type QuoteRequestRow = {
  case_id: string;
  requested_at: string;
  issued_at: string | null;
  case_ids: { code: string; protected_party_name: string | null } | { code: string; protected_party_name: string | null }[] | null;
};

type LoginActivityRow = {
  id: string;
  attempted_identifier: string | null;
  ip_address: string | null;
  success: boolean;
  created_at: string;
  staff_profiles: { display_name: string | null } | { display_name: string | null }[] | null;
};

function unwrap<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

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
            <p>This account does not have admin access, or has been banned/deactivated.</p>
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

  const { data: staffOptions } = await supabase
    .from("staff_profiles")
    .select("id, display_name, role")
    .eq("active", true)
    .order("display_name");

  const { data: caseIds } = await supabase
    .from("case_ids")
    .select(
      "id, code, email, onboarding_enabled, status, is_admin_seed, specialist_name, protected_party_name, case_overview, client_status, notes, created_at, staff_profiles!assigned_staff_id(display_name)"
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
    .select("id, display_name, role, active, banned, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: quoteRequests } = await supabase
    .from("case_quotes")
    .select("case_id, requested_at, issued_at, case_ids(code, protected_party_name)")
    .not("requested_at", "is", null)
    .is("issued_at", null)
    .order("requested_at", { ascending: true });

  const { data: loginActivity } = await supabase
    .from("staff_login_activity")
    .select("id, attempted_identifier, ip_address, success, created_at, staff_profiles(display_name)")
    .order("created_at", { ascending: false })
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
            <h1>Admin Dashboard</h1>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/808admin-panel/presets" className="btn btn-outline btn-sm">
                Quote Presets
              </Link>
              <form action={logoutAdminPanel}>
                <button type="submit" className="btn btn-outline btn-sm">
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          {quoteRequests && quoteRequests.length > 0 && (
            <div className="panel" style={{ marginTop: 24, border: "2px solid var(--alert)" }}>
              <div className="panel-head">
                <h3>⚠ Urgent: Quotes Awaiting Issue</h3>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Protected Party</th>
                    <th>Requested</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(quoteRequests as QuoteRequestRow[]).map((q) => {
                    const info = unwrap(q.case_ids);
                    return (
                      <tr key={q.case_id}>
                        <td className="mono small">{info?.code ?? "—"}</td>
                        <td>{info?.protected_party_name ?? "—"}</td>
                        <td>{new Date(q.requested_at).toLocaleString()}</td>
                        <td>
                          <Link href={`/808admin-panel/case/${q.case_id}`} className="btn btn-danger btn-sm">
                            Issue Quote
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                <label htmlFor="specialistName">Assigned Specialist (display name)</label>
                <input id="specialistName" name="specialistName" type="text" />
              </div>
              <div className="field">
                <label htmlFor="assignedStaffId">Assign to (controls access)</label>
                <select id="assignedStaffId" name="assignedStaffId" defaultValue="">
                  <option value="">Myself (Admin)</option>
                  {(staffOptions ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.display_name ?? s.id} ({s.role})
                    </option>
                  ))}
                </select>
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
            <h2>All Cases</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Onboarding</th>
                  <th>Assigned To</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(caseIds ?? []).map((c) => {
                  const assignee = unwrap(
                    c.staff_profiles as { display_name: string | null } | { display_name: string | null }[] | null
                  );
                  return (
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
                      <td>{assignee?.display_name ?? "Unassigned"}</td>
                      <td>
                        <Link href={`/808admin-panel/case/${c.id}`} className="small">
                          Open Case →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {(!caseIds || caseIds.length === 0) && (
                  <tr>
                    <td colSpan={6}>No case IDs yet.</td>
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
                {((sessions as CaseSessionRow[] | null) ?? []).map((s) => {
                  const info = unwrap(s.case_ids);
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(workers ?? []).map((w) => (
                  <tr key={w.id}>
                    <td>{w.display_name ?? "—"}</td>
                    <td>{w.role}</td>
                    <td>
                      {w.banned ? (
                        <span className="badge badge-denied">Banned</span>
                      ) : (
                        <span className={`badge ${w.active ? "badge-active" : "badge-pending"}`}>
                          {w.active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td style={{ display: "flex", gap: 8 }}>
                      {w.active && !w.banned && (
                        <form action={deactivateWorker}>
                          <input type="hidden" name="id" value={w.id} />
                          <button type="submit" className="btn btn-outline btn-sm">
                            Deactivate
                          </button>
                        </form>
                      )}
                      {!w.banned ? (
                        <form action={banWorker}>
                          <input type="hidden" name="id" value={w.id} />
                          <button type="submit" className="btn btn-danger btn-sm">
                            Ban
                          </button>
                        </form>
                      ) : (
                        <form action={unbanWorker}>
                          <input type="hidden" name="id" value={w.id} />
                          <button type="submit" className="btn btn-outline btn-sm">
                            Unban
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
            <h2>Recent Login Activity</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>IP</th>
                  <th>Result</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {((loginActivity as LoginActivityRow[] | null) ?? []).map((l) => {
                  const staff = unwrap(l.staff_profiles);
                  return (
                    <tr key={l.id}>
                      <td>{staff?.display_name ?? l.attempted_identifier ?? "—"}</td>
                      <td className="mono small">{l.ip_address ?? "—"}</td>
                      <td>
                        {l.success ? (
                          <span className="badge badge-active">Success</span>
                        ) : (
                          <span className="badge badge-denied">Failed</span>
                        )}
                      </td>
                      <td>{new Date(l.created_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
                {(!loginActivity || loginActivity.length === 0) && (
                  <tr>
                    <td colSpan={4}>No login activity yet.</td>
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