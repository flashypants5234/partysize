import { unwrap, type CaseSessionRow } from "./admin-types";

export default function ActiveSessionsPanel({ sessions }: { sessions: CaseSessionRow[] }) {
  return (
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
          {sessions.map((s) => {
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
          {sessions.length === 0 && (
            <tr>
              <td colSpan={4}>No sessions yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}