import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <Image
                src="/assets/brand-logo.png"
                alt="FDIC — Federal Deposit Insurance Corporation"
                width={2000}
                height={914}
                className="brand-logo-footer"
              />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff" }}>
                ASSET SHIELD
              </span>
            </div>
            <p style={{ color: "#8492A6", maxWidth: "36ch" }}>
              Independent asset insurance. Not a bank. Not a government agency. This portal is for
              clients with an active case ID from their specialist.
            </p>
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
          Asset Shield is an independent, privately held company and is not affiliated with,
          endorsed by, or a part of the U.S. government or any federal agency, including the FDIC.
        </p>
      </div>
    </footer>
  );
}