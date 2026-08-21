import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { getCategory } from "@/data/coverage-categories";
import { recordActivity } from "@/lib/activity";
import GovStrip from "@/components/GovStrip";
import TrackPage from "@/components/portal/TrackPage";

export default async function QuotePage() {
  const session = await getCaseSession();
  if (!session) {
    redirect("/access");
  }

  const categoryKey = session.responses?.category ?? session.selected_category;
  const category = categoryKey ? getCategory(categoryKey) : undefined;
  const answers = session.responses?.answers ?? {};

  const isIssued = Boolean(session.quote_issued_at && session.quote_text);

  await recordActivity({
    eventType: isIssued ? "quote_viewed" : "quote_pending_viewed",
    pagePath: "/quote",
    metadata: { category: categoryKey ?? null },
  });

  return (
    <div className="as-skin">
      <TrackPage path="/quote" />
      <GovStrip />
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

      <main className="case-shell">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow">Your Quote</div>
          <h1>{isIssued ? "Your Custom Quote" : "Preparing Your Quote"}</h1>

          <div className="quote-box" data-no-edit>
            {isIssued ? (
              <>
                <div
                  className="quote-amount"
                  style={{ fontSize: "1.3rem", whiteSpace: "pre-wrap", textAlign: "left" }}
                >
                  {session.quote_text}
                </div>
                <p className="small" style={{ color: "var(--slate-light)", marginTop: 12 }}>
                  Issued {new Date(session.quote_issued_at as string).toLocaleString()}. This quote is
                  confidential and prepared specifically for you.
                </p>
              </>
            ) : (
              <p className="small" style={{ color: "var(--slate-light)" }}>
                Your specialist{session.specialist_name ? `, ${session.specialist_name},` : ""} has been
                notified and is preparing your custom quote. Check back shortly, or we&apos;ll follow up
                directly.
              </p>
            )}
          </div>

          {category && (
            <section style={{ marginTop: 36 }}>
              <div className="eyebrow">Your Protection Review</div>
              <h2 style={{ marginTop: 4 }}>{category.label}</h2>
              <div className="review-list" data-no-edit>
                {category.questions.map((q) => (
                  <div key={q.key} className="review-row">
                    <span className="review-q">{q.label}</span>
                    <span className="review-a">{answers[q.key] ?? "Not answered"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section style={{ marginTop: 36 }}>
            <div className="eyebrow">Case Details</div>
            <div className="case-found" style={{ marginTop: 12 }} data-no-edit>
              <div className="info-grid">
                <div className="info-field">
                  <label>Assigned Specialist</label>
                  <div className="val">{session.specialist_name ?? "Not yet assigned"}</div>
                </div>
                <div className="info-field">
                  <label>Protected Party</label>
                  <div className="val">{session.protected_party_name ?? "—"}</div>
                </div>
                <div className="info-field">
                  <label>Case ID</label>
                  <div className="val mono">{session.case_code}</div>
                </div>
                <div className="info-field">
                  <label>Status</label>
                  <div className="val">
                    <span className="badge badge-active">{session.client_status}</span>
                  </div>
                </div>
                <div className="info-field full">
                  <label>Case Overview</label>
                  <div className="val">
                    {session.case_overview ?? "Your specialist will add an overview shortly."}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Link href="/portal" className="btn btn-outline btn-block" style={{ marginTop: 24 }}>
            Back to Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
