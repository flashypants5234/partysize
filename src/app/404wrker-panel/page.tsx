import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { loginWorkerPanel, logoutWorkerPanel, createCaseId } from "./actions";

type ActivityRow = {
  code: string;
  client_status: string;
  onboarding_enabled: boolean;
  created_at: string;
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
            <p>This account does not have worker access, or has been banned/deactivated.</p>
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

  const { data: myCases } = await supabase
    .from("case_ids")
    .select("id, code, email, onboarding_enabled, client_status, specialist_name, protected_party_name, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: activity } = await supabase.rpc("list_recent_case_activity");

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

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Create Case ID</h2>
            <p className="small" style={{ color: "var(--slate-light)" }}>
              New cases are assigned to you automatically.
            </p>
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
            <h2>My Cases</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Onboarding</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(myCases ?? []).map((c) => (
                  <tr key={c.id}>
                    <td>{c.code}</td>
                    <td>{c.email ?? "—"}</td>
                    <td>
                      <span className="badge badge-active">{c.client_status ?? "Active"}</span>
                    </td>
                    <td>{c.onboarding_enabled ? "On" : "Off"}</td>
                    <td>
                      <Link href={`/404wrker-panel/case/${c.id}`} className="small">
                        Open Case →
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!myCases || myCases.length === 0) && (
                  <tr>
                    <td colSpan={5}>No cases assigned to you yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 24 }}>
            <h2>Recent Case Activity</h2>
            <p className="small" style={{ color: "var(--slate-light)" }}>
              Limited view across all cases — codes and status only.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Onboarding</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {((activity as ActivityRow[] | null) ?? []).map((a) => (
                  <tr key={a.code}>
                    <td className="mono small">{a.code}</td>
                    <td>{a.client_status}</td>
                    <td>{a.onboarding_enabled ? "On" : "Off"}</td>
                    <td>{new Date(a.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {(!activity || activity.length === 0) && (
                  <tr>
                    <td colSpan={4}>No recent activity.</td>
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