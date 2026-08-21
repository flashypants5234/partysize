import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export default function WelcomePage() {
  return (
    <div className="as-skin">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand link-plain">
            <svg
              className="brand-mark"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20 2 L36 8 V19 C36 29 29 35 20 38 C11 35 4 29 4 19 V8 Z"
                fill="#0A1930"
                stroke="#B9932C"
                strokeWidth="1.4"
              />
              <path
                d="M20 12 L22.8 17.2 L28.5 18 L24.3 21.8 L25.4 27.5 L20 24.6 L14.6 27.5 L15.7 21.8 L11.5 18 L17.2 17.2 Z"
                fill="#B9932C"
              />
            </svg>
            <span className="brand-word">
              ASSET SHIELD<span className="placeholder-tag">Company name — placeholder</span>
            </span>
          </Link>
        </div>
      </header>

      <section className="case-hero">
        <div className="container case-hero-grid">
          <div>
            <div className="eyebrow">Client Support Portal</div>
            <h1>Welcome.</h1>
            <p className="hero-lede">
              Your specialist has set up a case for you. Continue below to review your case,
              choose what you&apos;d like covered, and get a same-day estimate.
            </p>
            <div className="hero-actions" style={{ marginTop: 30 }}>
              <Link href="/access" className="btn btn-brass">
                Continue to My Case
              </Link>
            </div>
          </div>

          <div className="case-visual">
            <span className="ph-label">Photo / campaign placeholder</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}