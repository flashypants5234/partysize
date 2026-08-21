import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { CATEGORIES } from "@/data/coverage-categories";
import { chooseCategory, logOutCaseSession } from "./actions";
import CategoryIcon from "@/components/CategoryIcon";
import GovStrip from "@/components/GovStrip";
import TrackPage from "@/components/portal/TrackPage";
import "@/styles/category-buttons.css";

export default async function PortalPage() {
  const session = await getCaseSession();

  if (!session) {
    redirect("/access");
  }

  return (
    <div className="as-skin">
      <TrackPage path="/portal" />
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
          <form action={logOutCaseSession}>
            <button type="submit" className="btn btn-outline btn-sm">
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className="case-shell">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="case-found" data-no-edit>
            <div className="case-found-badge">✓ Case located successfully</div>
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
                <div className="val">{session.case_overview ?? "Your specialist will add an overview shortly."}</div>
              </div>
              <div className="info-field full">
                <label>Case Notes</label>
                <div className="val">{session.case_notes ?? "No notes on file."}</div>
              </div>
            </div>
          </div>

          <h2 className="text-center" style={{ marginTop: 44 }}>
            What would you like to insure today?
          </h2>
          <p className="text-center small">Select a category below to continue.</p>

          <div className="category-grid-support">
            {CATEGORIES.map((cat) => (
              <form key={cat.key} action={chooseCategory}>
                <input type="hidden" name="category" value={cat.key} />
                <button type="submit" className="category-btn">
                  <span className="category-btn-icon">
                    <CategoryIcon category={cat.key} size={28} />
                  </span>
                  <span className="category-btn-label">{cat.label}</span>
                  <span className="category-btn-desc">{cat.description}</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}