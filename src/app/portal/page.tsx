import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { CATEGORIES } from "@/data/coverage-categories";
import { chooseCategory, logOutCaseSession } from "./actions";
import CategoryIcon from "@/components/CategoryIcon";
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
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand link-plain">
            <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20 2 L36 8 V19 C36 29 29 35 20 38 C11 35 4 29 4 19 V8 Z" fill="#0A1930" stroke="#B9932C" strokeWidth="1.4" />
              <path d="M20 12 L22.8 17.2 L28.5 18 L24.3 21.8 L25.4 27.5 L20 24.6 L14.6 27.5 L15.7 21.8 L11.5 18 L17.2 17.2 Z" fill="#B9932C" />
            </svg>
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
          <div className="case-found">
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