import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <div className="as-skin">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* ============ UTILITY BAR ============ */}
      <div className="utility-bar">
        <div className="container">
          <div className="utility-links">
            <a href="#">Resources for agents</a>
            <a href="#">Partners</a>
            <a href="#">Financial professionals</a>
          </div>
          <div className="utility-right">
            <a href="#">Career seekers</a>
          </div>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <header className="site-header" style={{ position: "static" }}>
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
          <div className="header-search">
            <input type="text" placeholder="Search" />
            <button aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#1A2233" strokeWidth="2" />
                <path d="M21 21l-4-4" stroke="#1A2233" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <Link href="/access" className="btn btn-primary btn-sm">
            Log In
          </Link>
        </div>
      </header>

      {/* ============ SUBNAV ============ */}
      <div className="subnav">
        <div className="container">
          <div className="subnav-links">
            <Link href="/coverage">Digital Holdings</Link>
            <Link href="/coverage">Savings</Link>
            <Link href="/coverage">Personal Valuables</Link>
            <Link href="/coverage">Vehicles</Link>
            <Link href="/coverage">Property</Link>
          </div>
          <div className="subnav-actions">
            <Link href="/claims" className="btn btn-outline btn-sm">
              Claims
            </Link>
          </div>
        </div>
      </div>

      <main id="main">
        {/* ============ QUOTE HERO ============ */}
        <section className="quote-hero">
          <div className="quote-hero-grid">
            <div className="quote-hero-left">
              <h1>We protect more of what you own</h1>
              <p>For the assets your bank and your standard policy leave out, Asset Shield is on your side.</p>
              <div className="quote-widget">
                <select aria-label="Asset type" defaultValue="Digital holdings bundle">
                  <option>Digital holdings bundle</option>
                  <option>Savings supplement</option>
                  <option>Jewelry &amp; valuables</option>
                  <option>Vehicle value protection</option>
                </select>
                <input type="text" placeholder="ZIP Code" />
                <Link href="/access" className="btn btn-brass btn-block">
                  Start your quote
                </Link>
                <div className="quote-links">
                  <Link href="/about#contact">Find an agent »</Link>
                  <Link href="/coverage">Explore coverage options »</Link>
                </div>
              </div>
            </div>
            <div className="quote-hero-right">
              <div className="photo-placeholder">
                <span className="ph-label">Photo / campaign placeholder</span>
                <div className="photo-caption">Coverage that actually gets it.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ QUICK ACTION TILES ============ */}
        <section className="bg-white" style={{ padding: 0 }}>
          <div className="container action-tiles">
            <div className="action-tile">
              <div className="icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>No login required</h3>
              <p className="small">What would you like to do?</p>
              <div className="action-tile-row">
                <select aria-label="Quick action" defaultValue="Pay a policy bill">
                  <option>Pay a policy bill</option>
                  <option>Get a certificate copy</option>
                  <option>Contact an agent</option>
                </select>
              </div>
              <Link href="/portal" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                Go
              </Link>
            </div>
            <div className="action-tile">
              <div className="icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Find a local agent</h3>
              <p className="small">Discuss your policy or request a quote.</p>
              <div className="action-tile-row">
                <input type="text" placeholder="ZIP Code" />
                <Link href="/about#contact" className="btn btn-outline btn-sm">
                  Go
                </Link>
              </div>
            </div>
            <div className="action-tile">
              <div className="icon-circle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-7-4.4-9.3-9C1.2 8.4 3 5 6.4 5c2 0 3.4 1.1 4.1 2.3C11.2 6.1 12.6 5 14.6 5 18 5 19.8 8.4 18.3 12c-2.3 4.6-6.3 9-6.3 9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Not sure where to start</h3>
              <p className="small">We&apos;ll help you find the right coverage.</p>
              <Link href="/coverage" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                Start Quote
              </Link>
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* ============ MEMBER BANNER ============ */}
        <div className="member-banner">
          <div className="container">
            <div className="member-banner-left">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l4-4 4 4 4-8 4 8" stroke="#B9932C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>Are you a policyholder?</strong>
                <p>Check out the services and benefits available to you.</p>
              </div>
            </div>
            <Link href="/portal" className="btn btn-outline-light">
              Policyholder resource guide
            </Link>
          </div>
        </div>

        {/* ============ PROMO IMAGE GRID ============ */}
        <section className="bg-white">
          <div className="container">
            <div className="promo-grid">
              <div className="promo-card">
                <div className="photo-placeholder">
                  <span className="ph-label">Photo placeholder</span>
                  <div className="photo-caption">Why appraisals matter</div>
                </div>
              </div>
              <div className="promo-card">
                <div className="photo-placeholder">
                  <span className="ph-label">Photo placeholder</span>
                  <div className="photo-caption">Let us protect your holdings, too</div>
                </div>
              </div>
            </div>
            <div className="promo-grid-split">
              <div className="promo-card" style={{ height: 260 }}>
                <div className="photo-placeholder">
                  <span className="ph-label">Photo placeholder</span>
                  <div className="photo-caption">Protect your small business</div>
                </div>
              </div>
              <div className="promo-stack">
                <div className="promo-card">
                  <div
                    className="photo-placeholder"
                    style={{ background: "linear-gradient(160deg, var(--brass) 0%, var(--navy-950) 140%)" }}
                  >
                    <div className="photo-caption">Save when you bundle savings and crypto coverage</div>
                  </div>
                </div>
                <div className="promo-card">
                  <div className="photo-placeholder">
                    <div className="photo-caption">Easy access to manage coverage online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ NARRATIVE ============ */}
        <section style={{ textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2>Protecting what&apos;s actually yours</h2>
            <p>
              We started Asset Shield because standard insurers were still writing policies for a world of houses and
              cars, while a growing share of what people actually hold — crypto, valuables, balances above deposit
              limits — sat unprotected.
            </p>
            <p>
              Today we cover four asset classes with one standard: a real certificate, a claims process you can
              track, and terms written in plain language. We&apos;ve served policyholders since day one, and we
              intend to keep answering to them first.
            </p>
          </div>
        </section>

        {/* ============ BUSINESS BAND ============ */}
        <div style={{ background: "var(--navy-950)", padding: "20px 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", gap: 14, color: "#fff" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="9" width="18" height="12" rx="1.5" stroke="#B9932C" strokeWidth="2" />
              <path d="M8 9V6a4 4 0 018 0v3" stroke="#B9932C" strokeWidth="2" />
            </svg>
            <span>
              Have business assets to protect?{" "}
              <Link href="/about#contact" style={{ color: "#fff", textDecoration: "underline" }}>
                See what we offer for businesses.
              </Link>
            </span>
          </div>
        </div>

        {/* ============ MOBILE APP BAND ============ */}
        <div className="app-band">
          <div className="container">
            <div>
              <div className="eyebrow" style={{ color: "#DCE6F4" }}>
                Get easy 24/7 access
              </div>
              <h3>Asset Shield Mobile</h3>
              <ul>
                <li>Easy way to pay premiums</li>
                <li>Instant access to certificates</li>
                <li>File and track a claim</li>
              </ul>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="qr-placeholder" aria-hidden="true" />
              <p style={{ color: "#fff", margin: 0 }}>
                Scan this code with your phone or <a href="#" style={{ color: "#fff" }}>click here</a> to download
                the app.
              </p>
            </div>
          </div>
        </div>

        <p className="small" style={{ maxWidth: 1180, margin: "20px auto", padding: "0 24px", color: "var(--slate-light)" }}>
          Figures shown throughout this page are illustrative placeholder content for this design draft, not actual
          policy terms.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
