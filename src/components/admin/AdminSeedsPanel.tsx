import type { AdminSeedRow } from "./admin-types";

export default function AdminSeedsPanel({
  seeds,
  createAdminSeed,
}: {
  seeds: AdminSeedRow[];
  createAdminSeed: (formData: FormData) => void;
}) {
  return (
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
          {seeds.map((s) => (
            <tr key={s.id}>
              <td>{s.code}</td>
              <td>{s.status}</td>
              <td>{s.notes ?? "—"}</td>
            </tr>
          ))}
          {seeds.length === 0 && (
            <tr>
              <td colSpan={3}>No admin seeds yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}