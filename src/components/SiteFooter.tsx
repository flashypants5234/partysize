import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 28, height: 28 }}>
                <path d="M20 2 L36 8 V19 C36 29 29 35 20 38 C11 35 4 29 4 19 V8 Z" fill="#F6F4EE" stroke="#B9932C" strokeWidth="1.4" />
                <path d="M20 12 L22.8 17.2 L28.5 18 L24.3 21.8 L25.4 27.5 L20 24.6 L14.6 27.5 L15.7 21.8 L11.5 18 L17.2 17.2 Z" fill="#B9932C" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff" }}>ASSET SHIELD</span>
            </div>
            <p style={{ color: "#8492A6", maxWidth: "32ch" }}>
              Independent asset insurance. Not a bank. Not a government agency. Just serious coverage.
            </p>
          </div>
          <div>
            <h4>Coverage</h4>
            <Link href="/coverage">Digital Holdings</Link>
            <Link href="/coverage">Savings Accounts</Link>
            <Link href="/coverage">Jewelry & Valuables</Link>
            <Link href="/coverage">Vehicles</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/claims">Claims</Link>
            <Link href="/about#faq">FAQ</Link>
            <Link href="/about#contact">Contact</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link href="/access">Access My Case</Link>
            <Link href="/404wrker-panel">Employee Portal</Link>
            <Link href="/808admin-panel">Admin Portal</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Asset Shield, Inc. — placeholder name.</span>
          <span>Prototype build — not a licensed insurer yet</span>
        </div>
        <p className="footer-legal">
          Asset Shield is an independent, privately held company and is not affiliated with, endorsed by, or a part of
          the U.S. government or any federal agency, including the FDIC. Coverage figures shown are illustrative
          placeholder content for this design draft.
        </p>
      </div>
    </footer>
  );
}