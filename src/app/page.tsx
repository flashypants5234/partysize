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
            <section className="case-hero case-hero-bgimg-home">
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
                            <Link href="/access" className="btn btn-brass btn-continue">Continue to My Case
                                <svg
                                    className="btn-arrow"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true">
                                    <path d="M2 8 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                                    <path d="M9.5 4 L13.5 8 L9.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div className="case-visual case-visual-photo">
                        <Image
                            src="/assets/hero-photo.jpg"
                            alt="FDIC document folder with gold embossing on a wooden desk"
                            width={1038}
                            height={550}
                            className="case-visual-img"
                        />
                    </div>
                </div>
            </section>
            <SiteFooter />
        </div>
    );
}