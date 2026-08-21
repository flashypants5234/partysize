import Link from "next/link";
import { unwrap, type QuoteRequestRow } from "./admin-types";

export default function QuoteRequestsPanel({ quoteRequests }: { quoteRequests: QuoteRequestRow[] }) {
  if (quoteRequests.length === 0) return null;

  return (
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
          {quoteRequests.map((q) => {
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
  );
}