import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ClaimsPage() {
  return (
    <div className="as-skin">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader active="/claims" />

      <main id="main">
        <section className="hero" style={{ padding: "56px 0 64px" }}>
          <div className="container">
            <div className="eyebrow">Claims</div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>Filing a claim shouldn&apos;t feel like a fight.</h1>
            <p className="hero-lede">
              Every claim moves through the same four checkpoints, and you can see exactly where yours stands from
              your dashboard — no phone tag required.
            </p>
          </div>
        </section>

        <section className="bg-white" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="steps" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 64 }}>
              <div className="step">
                <h3>File</h3>
                <p>Submit the incident details and supporting documents from your dashboard. Takes about 10 minutes.</p>
              </div>
              <div className="step">
                <h3>Verify</h3>
                <p>An adjuster reviews your certificate and documentation, and may request additional evidence.</p>
              </div>
              <div className="step">
                <h3>Decide</h3>
                <p>You&apos;ll get a written determination with the exact policy clause it&apos;s based on — approved or denied.</p>
              </div>
              <div className="step">
                <h3>Pay</h3>
                <p>Approved claims are paid within 3 business days by direct deposit.</p>
              </div>
            </div>

            <div className="section-head">
              <div className="eyebrow">Sample Claim Status</div>
              <h2>What tracking looks like in your dashboard</h2>
            </div>

            <div className="certificate" style={{ maxWidth: 560 }}>
              <div className="certificate-stamp pending">Under Review</div>
              <div className="certificate-header">
                <div>
                  <div className="certificate-eyebrow">Claim Reference</div>
                  <div className="certificate-title">Jewelry &amp; Valuables Claim</div>
                  <div className="certificate-serial">No. CLM-2026-004421</div>
                </div>
              </div>
              <div className="certificate-body">
                <div className="certificate-field">
                  <label>Filed</label>
                  <div className="val">Aug 12, 2026</div>
                </div>
                <div className="certificate-field">
                  <label>Requested</label>
                  <div className="val">$8,400</div>
                </div>
                <div className="certificate-field">
                  <label>Adjuster</label>
                  <div className="val">M. Chen</div>
                </div>
                <div className="certificate-field">
                  <label>Est. Decision</label>
                  <div className="val">Aug 22, 2026</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 36 }}>
              <h3>What you&apos;ll need on hand</h3>
              <ul style={{ color: "var(--slate)", lineHeight: 1.9 }}>
                <li>Your certificate serial number</li>
                <li>A police report, if theft or loss is involved</li>
                <li>Photos or transaction records showing the loss</li>
                <li>Original appraisal or purchase documentation, where applicable</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container">
            <h2>Already covered and need to file?</h2>
            <p>Log in to start a claim in minutes.</p>
            <div className="hero-actions" style={{ justifyContent: "center", marginTop: 26 }}>
              <Link href="/access" className="btn btn-brass">
                Log In to File
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
