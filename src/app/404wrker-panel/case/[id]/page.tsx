import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCategory } from "@/data/coverage-categories";
import { updateCaseDetails, toggleOnboardingAction, addWorkerNote } from "../../actions";

type NoteRow = { id: string; note: string; created_at: string };
type SessionRow = {
  id: string;
  current_step: string;
  selected_category: string | null;
  started_at: string;
  last_activity_at: string;
};

export default async function WorkerCaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/404wrker-panel");
  }

  const { data: role } = await supabase.rpc("current_staff_role");
  if (role !== "worker" && role !== "admin") {
    redirect("/404wrker-panel");
  }

  const { data: caseRow } = await supabase
    .from("case_ids")
    .select(
      "id, code, onboarding_enabled, specialist_name, protected_party_name, case_overview, client_status, notes"
    )
    .eq("id", id)
    .maybeSingle();

  if (!caseRow) {
    return (
      <main className="as-skin">
        <section className="section">
          <div className="container" style={{ maxWidth: 480 }}>
            <h1>Case Not Found</h1>
            <p>This case doesn&apos;t exist, or it isn&apos;t assigned to you.</p>
            <Link href="/404wrker-panel" className="btn btn-outline">
              Back to Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { data: sessions } = await supabase
    .from("case_sessions")
    .select("id, current_step, selected_category, started_at, last_activity_at")
    .eq("case_id", id)
    .order("last_activity_at", { ascending: false });

  const { data: latestResponse } = await supabase
    .from("onboarding_responses")
    .select("responses, submitted_at")
    .eq("case_id", id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: notes } = await supabase
    .from("worker_case_notes")
    .select("id, note, created_at")
    .eq("case_id", id)
    .order("created_at", { ascending: false });

  const responseData = latestResponse?.responses as
    | { category?: string; answers?: Record<string, string> }
    | undefined;
  const category = responseData?.category ? getCategory(responseData.category) : undefined;
  const answers = responseData?.answers ?? {};

  return (
    <main className="as-skin">
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <Link href="/404wrker-panel" className="small">
            ← Back to Dashboard
          </Link>
          <h1 style={{ marginTop: 12 }}>Case {caseRow.code}</h1>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }} data-no-edit>
              {error}
            </p>
          )}

          <div className="panel" data-no-edit>
            <div className="case-found-badge">✓ Case located successfully</div>
            <div className="info-grid">
              <div className="info-field">
                <label>Assigned Specialist</label>
                <div className="val">{caseRow.specialist_name ?? "Not yet assigned"}</div>
              </div>
              <div className="info-field">
                <label>Protected Party</label>
                <div className="val">{caseRow.protected_party_name ?? "—"}</div>
              </div>
              <div className="info-field full">
                <label>Case Overview</label>
                <div className="val">{caseRow.case_overview ?? "[placeholder]"}</div>
              </div>
              <div className="info-field">
                <label>Status</label>
                <div className="val">
                  <span className="badge badge-active">{caseRow.client_status}</span>
                </div>
              </div>
              <div className="info-field full">
                <label>Case Notes</label>
                <div className="val">{caseRow.notes ?? "No notes on file."}</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Edit Case Details</h3>
            </div>
            <form action={updateCaseDetails}>
              <input type="hidden" name="caseId" value={caseRow.id} />
              <div className="field-row">
                <div className="field">
                  <label>Specialist name</label>
                  <input name="specialistName" type="text" defaultValue={caseRow.specialist_name ?? ""} />
                </div>
                <div className="field">
                  <label>Protected party</label>
                  <input
                    name="protectedPartyName"
                    type="text"
                    defaultValue={caseRow.protected_party_name ?? ""}
                  />
                </div>
              </div>
              <div className="field">
                <label>Case overview</label>
                <textarea name="caseOverview" rows={2} defaultValue={caseRow.case_overview ?? ""} />
              </div>
              <div className="field">
                <label>Case notes</label>
                <textarea name="notes" rows={2} defaultValue={caseRow.notes ?? ""} />
              </div>
              <div className="field">
                <label>Client-facing status</label>
                <input name="clientStatus" type="text" defaultValue={caseRow.client_status ?? "Active"} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Changes
              </button>
            </form>

            <form action={toggleOnboardingAction} style={{ marginTop: 14 }}>
              <input type="hidden" name="caseId" value={caseRow.id} />
              <input type="hidden" name="enabled" value={(!caseRow.onboarding_enabled).toString()} />
              <button type="submit" className="btn btn-outline btn-sm">
                {caseRow.onboarding_enabled ? "Disable Onboarding Questionnaire" : "Enable Onboarding Questionnaire"}
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Client Selections</h3>
            </div>
            <div data-no-edit>
            {category ? (
              <>
                <p>
                  <strong>Category:</strong> {category.label}
                </p>
                <div className="review-list">
                  {category.questions.map((q) => (
                    <div key={q.key} className="review-row">
                      <span className="review-q">{q.label}</span>
                      <span className="review-a">{answers[q.key] ?? "Not answered"}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="small">No selections submitted yet.</p>
            )}

            {sessions && sessions.length > 0 && (
              <table className="table" style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Category</th>
                    <th>Started</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {(sessions as SessionRow[]).map((s) => (
                    <tr key={s.id}>
                      <td>{s.current_step}</td>
                      <td>{s.selected_category ?? "—"}</td>
                      <td>{new Date(s.started_at).toLocaleString()}</td>
                      <td>{new Date(s.last_activity_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>My Private Notes</h3>
            </div>
            <p className="small" style={{ color: "var(--slate-light)" }}>
              Only visible to you and admin.
            </p>
            <div data-no-edit>
            {((notes as NoteRow[] | null) ?? []).map((n) => (
              <div key={n.id} className="review-row" style={{ display: "block" }}>
                <div className="small" style={{ color: "var(--slate-light)" }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
                <div>{n.note}</div>
              </div>
            ))}
            {(!notes || notes.length === 0) && <p className="small">No notes yet.</p>}
            </div>

            <form action={addWorkerNote} style={{ marginTop: 14 }}>
              <input type="hidden" name="caseId" value={caseRow.id} />
              <div className="field">
                <label htmlFor="note">Add a note</label>
                <textarea id="note" name="note" rows={3} required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Add Note
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}