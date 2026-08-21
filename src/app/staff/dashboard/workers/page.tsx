import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createWorkerAccount, deactivateWorker } from "../actions";

export default async function WorkersPage() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") {
    redirect("/staff/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data: workers } = await supabase
    .from("staff_profiles")
    .select("id, role, display_name, active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="app-topbar">
        <div>
          <h2 style={{ marginBottom: 2 }}>Employee Accounts</h2>
          <p className="small" style={{ margin: 0 }}>
            Create and manage worker accounts. Admin-only.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Current staff</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(workers ?? []).map((w) => (
              <tr key={w.id}>
                <td>{w.display_name ?? "—"}</td>
                <td>
                  <span className={`badge ${w.role === "admin" ? "badge-admin" : "badge-agent"}`}>{w.role}</span>
                </td>
                <td>
                  {w.active ? (
                    <span className="badge badge-active">Active</span>
                  ) : (
                    <span className="badge badge-pending">Deactivated</span>
                  )}
                </td>
                <td>
                  {w.role === "worker" && w.active && (
                    <form action={deactivateWorker.bind(null, w.id)}>
                      <button
                        type="submit"
                        className="small"
                        style={{ background: "none", border: "none", color: "var(--alert)", cursor: "pointer", padding: 0 }}
                      >
                        Deactivate
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {(!workers || workers.length === 0) && (
              <tr>
                <td colSpan={4} className="empty-state">
                  No worker accounts yet. Add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Add a new employee</h3>
        </div>
        <form action={createWorkerAccount}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" placeholder="Username" required />
            </div>
            <div className="field">
              <label htmlFor="password">Temporary password</label>
              <input id="password" name="password" type="password" placeholder="Temporary password" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="display_name">Display name (optional)</label>
            <input id="display_name" name="display_name" placeholder="Display name" />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Worker Account
          </button>
          <p className="form-note">New workers sign in with this username and password at /staff/login.</p>
        </form>
      </div>
    </div>
  );
}
