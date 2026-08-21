import { submitCaseId } from "./actions";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="as-skin">
      <section className="section">
        <div className="container" style={{ maxWidth: 460 }}>
          <h1>Client Login</h1>
          <p className="small">Enter your Case ID to access your portal.</p>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          <form action={submitCaseId} className="form-card">
            <div className="field">
              <label htmlFor="caseId">Case ID</label>
              <input
                id="caseId"
                name="caseId"
                type="text"
                placeholder="e.g. CASE-AB12CD"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Continue
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}