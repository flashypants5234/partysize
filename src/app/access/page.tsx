import Image from "next/image";
import Link from "next/link";
import GovStrip from "@/components/GovStrip";
import { submitCaseId } from "./actions";

export default async function AccessPage(
    {
        searchParams
    }: {
        searchParams: Promise<{
            error?: string;
        }>;
    }
) {
    const {
        error
    } = await searchParams;

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
            <section className="case-hero case-hero-bgimg">
                <div className="container case-hero-grid">
                    <div>
                        <div className="eyebrow">Case Portal</div>
                        <h1>Pick up right where your specialist left off.</h1>
                        <p className="hero-lede">Enter the Case ID you were given to review your case, choose what you'd like
                                          covered, and get a same-day estimate.
                                        </p>
                        <div className="case-widget">
                            {error && (<p
                                className="form-note"
                                style={{
                                    color: "var(--alert)"
                                }}>We couldn't find a case with that ID. Please check it and try again.
                                                </p>)}
                            <form action={submitCaseId}>
                                <div className="field">
                                    <label htmlFor="caseId">Case ID</label>
                                    <input
                                        id="caseId"
                                        name="caseId"
                                        type="text"
                                        placeholder="e.g. CASE-AB12CD"
                                        required />
                                </div>
                                <button type="submit" className="btn btn-brass btn-brass-white btn-block">Access My Case
                                                    </button>
                            </form>
                            <p className="case-widget-note">Don't have a Case ID? Your specialist will send you one directly.
                                              </p>
                        </div>
                    </div>
                    <div className="case-visual case-visual-photo">
                        <Image
                            src="/assets/access-hero.png"
                            alt="Conference table with documents, a folder, and a pen"
                            width={1361}
                            height={448}
                            className="case-visual-img"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}