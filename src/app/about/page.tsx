import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export default function AboutPage() {
  return (
    <div className="as-skin">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader active="/about" />

      <main id="main">
        <section className="hero" style={{ padding: "56px 0 64px" }}>
          <div className="container">
            <div className="eyebrow">About</div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>Built for the assets no one else takes seriously.</h1>
            <p className="hero-lede">
              Standard insurers were built around houses and cars. We built Asset Shield for the parts of a modern
              portfolio they still don&apos;t know how to underwrite — crypto, valuables, and the gap between what
              your bank covers and what you actually hold.
            </p>
          </div>
        </section>

        <section className="bg-white" style={{ paddingTop: 0 }}>
          <div className="container grid-2" style={{ alignItems: "start" }}>
            <div>
              <h2>Why we exist</h2>
              <p>
                Millions of Americans hold meaningful value in assets that fall outside traditional insurance —
                digital holdings, heirlooms, balances above deposit-insurance limits. When something goes wrong, they
                find out too late that nothing was actually protecting them.
              </p>
              <p>
                Asset Shield issues a real certificate of coverage for each policy, backs it with a claims process
                you can track step by step, and writes every term in plain language.
              </p>
            </div>
            <div>
              <h2>How we operate</h2>
              <p>
                We&apos;re an independent, privately held company — not a bank, and not a federal agency. Every
                policy is backed by our reserve fund and reinsurance partners, and reviewed by a member claims board
                rather than a black-box algorithm.
              </p>
              <p>
                We&apos;re licensed on a state-by-state basis as we expand; current licensing status is listed in
                your policy documents.
              </p>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="container">
            <div className="section-head center">
              <div className="eyebrow">FAQ</div>
              <h2>Common questions</h2>
            </div>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <details className="faq-item" open>
                <summary>Is Asset Shield a government program?</summary>
                <p>
                  No. Asset Shield is an independent, privately held insurance company. We are not affiliated with,
                  endorsed by, or part of the U.S. government or any federal agency.
                </p>
              </details>
              <details className="faq-item">
                <summary>How is my crypto policy priced?</summary>
                <p>
                  Premiums are based on the type of wallet (custodial vs. self-custody), asset value, and security
                  practices like multi-signature setups or hardware wallets.
                </p>
              </details>
              <details className="faq-item">
                <summary>What happens if a claim is denied?</summary>
                <p>
                  You&apos;ll receive a written explanation citing the specific policy clause, and you can request a
                  review from our member claims board within 30 days.
                </p>
              </details>
              <details className="faq-item">
                <summary>Can I insure more than one asset class?</summary>
                <p>
                  Yes. Most policyholders carry two or more policies — for example, a savings supplement plus a
                  digital holdings policy — each with its own certificate.
                </p>
              </details>
              <details className="faq-item">
                <summary>How fast are claims paid?</summary>
                <p>Approved claims are typically paid within 3 business days of the final determination, by direct deposit.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="bg-white" id="contact">
          <div className="container grid-2" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow">Contact</div>
              <h2>Talk to a real person</h2>
              <p>Questions about eligibility, an existing policy, or press inquiries — reach out and we&apos;ll route it to the right team.</p>
              <div className="small" style={{ marginTop: 20, lineHeight: 2 }}>
                <div>
                  <strong>General:</strong> hello@[yourdomain].com
                </div>
                <div>
                  <strong>Claims support:</strong> claims@[yourdomain].com
                </div>
                <div>
                  <strong>Hours:</strong> Mon–Fri, 8am–7pm ET
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
