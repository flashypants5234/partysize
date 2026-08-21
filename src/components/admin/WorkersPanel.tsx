import type { WorkerRow } from "./admin-types";

export default function WorkersPanel({
  workers,
  createWorkerAccount,
  deactivateWorker,
  banWorker,
  unbanWorker,
}: {
  workers: WorkerRow[];
  createWorkerAccount: (formData: FormData) => void;
  deactivateWorker: (formData: FormData) => void;
  banWorker: (formData: FormData) => void;
  unbanWorker: (formData: FormData) => void;
}) {
  return (
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
          {workers.map((w) => (
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
          {workers.length === 0 && (
            <tr>
              <td colSpan={4}>No worker accounts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}