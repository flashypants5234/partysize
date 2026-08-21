import Link from "next/link";
import { unwrap, type CaseRow } from "./admin-types";

export default function AllCasesPanel({
  cases,
  toggleOnboardingAction,
}: {
  cases: CaseRow[];
  toggleOnboardingAction: (formData: FormData) => void;
}) {
  return (
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
          {cases.map((c) => {
            const assignee = unwrap(c.staff_profiles);
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
          {cases.length === 0 && (
            <tr>
              <td colSpan={6}>No case IDs yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}