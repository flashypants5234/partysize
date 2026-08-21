import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CoveragePage() {
  return (
    <div className="as-skin">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader active="/coverage" />

      <main id="main">
        <section className="hero" style={{ padding: "56px 0 64px" }}>
          <div className="container">
            <div className="eyebrow">Coverage</div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>Real protection, four ways.</h1>
            <p className="hero-lede">
              Pick an asset class below for exact limits, exclusions, and what documentation you&apos;ll need at
              claim time. Every policy is issued as a certificate with a verifiable serial number.
            </p>
          </div>
        </section>

        <section className="bg-white" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="panel" style={{ marginBottom: 26 }}>
              <div className="panel-head">
                <div>
                  <span className="pill">01 · Digital Holdings</span>
                  <h3 style={{ marginTop: 10 }}>Cryptocurrency &amp; Digital Assets</h3>
                </div>
                <span className="coverage-limit" style={{ fontSize: "1.1rem" }}>
                  Up to $500,000
                </span>
              </div>
              <p>
                Covers custodial and self-custody wallets against theft, private-key compromise, exchange
                insolvency, and confirmed smart-contract exploits. Cold storage and multi-sig setups qualify for a
                lower premium tier.
              </p>
              <div className="grid-2" style={{ gap: 16, marginTop: 18 }}>
                <div className="small">
                  <strong>Covered:</strong> unauthorized transfers, exchange failure, verified hacks, lost
                  hardware-wallet access with documented recovery attempts.
                </div>
                <div className="small">
                  <strong>Not covered:</strong> losses from voluntarily shared credentials, market volatility, or
                  unregistered wallet addresses.
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 26 }}>
              <div className="panel-head">
                <div>
                  <span className="pill">02 · Savings Accounts</span>
                  <h3 style={{ marginTop: 10 }}>Deposit &amp; Savings Protection</h3>
                </div>
                <span className="coverage-limit" style={{ fontSize: "1.1rem" }}>
                  Up to $1,000,000
                </span>
              </div>
              <p>
                Supplemental deposit coverage for balances above standard bank insurance limits, or held at
                institutions without deposit insurance. Applies to savings, money market, and CD accounts at
                participating banks.
              </p>
              <div className="grid-2" style={{ gap: 16, marginTop: 18 }}>
                <div className="small">
                  <strong>Covered:</strong> institution failure, balances above standard federal deposit limits,
                  verified fraud losses.
                </div>
                <div className="small">
                  <strong>Not covered:</strong> accounts at non-participating institutions, disputes over account
                  ownership.
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 26 }}>
              <div className="panel-head">
                <div>
                  <span className="pill">03 · Jewelry &amp; Valuables</span>
                  <h3 style={{ marginTop: 10 }}>Appraised Personal Property</h3>
                </div>
                <span className="coverage-limit" style={{ fontSize: "1.1rem" }}>
                  Up to $250,000
                </span>
              </div>
              <p>
                Scheduled coverage for jewelry, watches, art, and heirlooms with a current appraisal. Worldwide
                coverage, no deductible on items under $2,500, and agreed-value payouts — no depreciation arguments
                at claim time.
              </p>
              <div className="grid-2" style={{ gap: 16, marginTop: 18 }}>
                <div className="small">
                  <strong>Covered:</strong> theft, loss, accidental damage, mysterious disappearance, worldwide.
                </div>
                <div className="small">
                  <strong>Not covered:</strong> unappraised items, normal wear, intentional damage.
                </div>
              </div>
            </div>

            <div className="panel" id="quote">
              <div className="panel-head">
                <div>
                  <span className="pill">04 · Vehicles</span>
                  <h3 style={{ marginTop: 10 }}>Vehicle Value Protection</h3>
                </div>
                <span className="coverage-limit" style={{ fontSize: "1.1rem" }}>
                  Up to $150,000
                </span>
              </div>
              <p>
                Layers on top of your existing auto policy to close total-loss and gap-value shortfalls, plus
                coverage for classic and collector vehicles that standard insurers undervalue.
              </p>
              <div className="grid-2" style={{ gap: 16, marginTop: 18 }}>
                <div className="small">
                  <strong>Covered:</strong> total-loss value gaps, collector-vehicle agreed value, uninsured-motorist
                  shortfalls.
                </div>
                <div className="small">
                  <strong>Not covered:</strong> mechanical breakdown, commercial-use vehicles.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container">
            <h2>Ready to see your number?</h2>
            <p>Start an application and get a same-day eligibility estimate.</p>
            <div className="hero-actions" style={{ justifyContent: "center", marginTop: 26 }}>
              <Link href="/access" className="btn btn-brass">
                Start Application
              </Link>
              <Link href="/about#contact" className="btn btn-outline-light">
                Ask a Question
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
