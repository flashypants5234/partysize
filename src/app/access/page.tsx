import Link from "next/link";
import { submitCaseId } from "./actions";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="as-skin">
      <main id="main">
        <section style={{ padding: "70px 0", minHeight: "70vh", display: "flex", alignItems: "center" }}>
          <div className="container" style={{ maxWidth: 460 }}>
            <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
              Secure Log In
            </div>
            <h1 className="text-center" style={{ fontSize: "2rem" }}>
              Welcome back.
            </h1>

            <div className="tabs">
              <div className="tab active">Customer</div>
              <Link href="/staff/login" className="tab">
                Employee
              </Link>
            </div>

            <form action={submitCaseId} className="form-card">
              <div className="field">
                <label htmlFor="caseId">Case ID</label>
                <input
                  id="caseId"
                  name="caseId"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. CASE-1029"
                  required
                />
              </div>

              {error && (
                <p role="alert" className="small" style={{ color: "var(--alert)" }}>
                  That Case ID couldn&apos;t be verified. Please check it and try again.
                </p>
              )}

              <button type="submit" className="btn btn-primary btn-block">
                Continue
              </button>
              <p className="form-note">Demo platform. Case IDs are issued for beta testing only.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer" style={{ padding: "26px 0" }}>
        <div className="container footer-bottom" style={{ borderTop: "none" }}>
          <span>&copy; {new Date().getFullYear()} Asset Shield, Inc. — placeholder name.</span>
          <span>Prototype build — not a licensed insurer yet</span>
        </div>
      </footer>
    </div>
  );
}
