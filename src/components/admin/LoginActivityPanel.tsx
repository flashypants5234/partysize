import { unwrap, type LoginActivityRow } from "./admin-types";

export default function LoginActivityPanel({ loginActivity }: { loginActivity: LoginActivityRow[] }) {
  return (
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
          {loginActivity.map((l) => {
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
          {loginActivity.length === 0 && (
            <tr>
              <td colSpan={4}>No login activity yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}