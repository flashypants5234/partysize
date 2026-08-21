import Image from "next/image";
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
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand link-plain">
            <Image
              src="/assets/brand-logo.png"
              alt="FDIC — Federal Deposit Insurance Corporation"
              width={2000}
              height={914}
              className="brand-logo"
              priority
            />
            <span className="brand-word">
              ASSET SHIELD<span className="placeholder-tag">Company name — placeholder</span>
            </span>
          </Link>
        </div>
      </header>

      <section className="case-hero">
        <div className="container case-hero-grid">
          <div>
            <div className="eyebrow">Case Portal</div>
            <h1>Pick up right where your specialist left off.</h1>
            <p className="hero-lede">
              Enter the Case ID you were given to review your case, choose what you&apos;d like
              covered, and get a same-day estimate.
            </p>

            <div className="case-widget">
              {error && (
                <p className="form-note" style={{ color: "var(--alert)" }}>
                  We couldn&apos;t find a case with that ID. Please check it and try again.
                </p>
              )}
              <form action={submitCaseId}>
                <div className="field">
                  <label htmlFor="caseId">Case ID</label>
                  <input id="caseId" name="caseId" type="text" placeholder="e.g. CASE-AB12CD" required />
                </div>
                <button type="submit" className="btn btn-brass btn-block">
                  Access My Case
                </button>
              </form>
              <p className="case-widget-note">
                Don&apos;t have a Case ID? Your specialist will send you one directly.
              </p>
            </div>
          </div>

          <div className="case-visual">
            <span className="ph-label">Photo / campaign placeholder</span>
          </div>
        </div>
      </section>
    </div>
  );
}