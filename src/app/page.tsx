import Image from "next/image";
import Link from "next/link";
import GovStrip from "@/components/GovStrip";
import SiteFooter from "@/components/SiteFooter";

export default function WelcomePage() {
    return (
        <div className="as-skin">
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
                            priority />
                        <span className="brand-word">ASSET SHIELD<span className="placeholder-tag">Company name — placeholder</span>
                        </span>
                    </Link>
                </div>
            </header>
            <section className="case-hero">
                <div className="container case-hero-grid">
                    <div>
                        <div className="eyebrow">Client Support Portal</div>
                        <h1>Welcome.</h1>
                        <p className="hero-lede">Your specialist has set up a case for you. Continue below to review your case,
                                          choose what you'd like covered, and get a same-day estimate.
                                        </p>
                        <div
                            className="hero-actions"
                            style={{
                                marginTop: 30
                            }}>
                            <Link href="/access" className="btn btn-brass">Continue to My Case
                                              </Link>
                        </div>
                    </div>
                    <div className="case-visual case-visual-photo">
                        <Image
                            src="/assets/hero-photo.png"
                            alt="FDIC brass nameplate on a desk with a pen and notepad"
                            width={277}
                            height={141}
                            className="case-visual-img"
                        />
                    </div>
                </div>
            </section>
            <SiteFooter />
        </div>
    );
}