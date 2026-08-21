import type { StaffOption } from "./admin-types";

export default function CreateCasePanel({
  staffOptions,
  action,
}: {
  staffOptions: StaffOption[];
  action: (formData: FormData) => void;
}) {
  return (
    <div className="panel" style={{ marginTop: 24 }}>
      <h2>Create Case ID</h2>
      <form action={action} className="field-row">
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
            {staffOptions.map((s) => (
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
  );
}