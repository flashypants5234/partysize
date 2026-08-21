import Link from "next/link";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pillars-band">
      <div className="container">
        <h2 className="text-center" style={{ marginBottom: 44 }}>
          Protecting what banks won&apos;t, for good.
        </h2>
        <div className="pillars-grid">
          <div>
            <div className="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="2" />
                <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="18" cy="7" r="2.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3>For you and your household</h3>
            <p>We protect crypto holdings, savings, jewelry, and vehicles.</p>
            <Link href="/coverage" className="btn btn-outline">
              Personal coverage
            </Link>
          </div>
          <div>
            <div className="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <path d="M9 8V6a3 3 0 013-3v0a3 3 0 013 3v2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3>For your business</h3>
            <p>We protect company treasury holdings and business-owned assets.</p>
            <Link href="/about#contact" className="btn btn-outline">
              Business coverage
            </Link>
          </div>
          <div>
            <div className="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>For your future</h3>
            <p>We protect long-term holdings and generational assets.</p>
            <Link href="/coverage" className="btn btn-outline">
              Long-term coverage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
