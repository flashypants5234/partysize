import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { getCategory } from "@/data/coverage-categories";
import { estimateQuote } from "@/lib/quote";

export default async function QuotePage() {
  const session = await getCaseSession();

  if (!session) {
    redirect("/access");
  }

  const categoryKey = session.responses?.category ?? session.selected_category;
  const category = categoryKey ? getCategory(categoryKey) : undefined;
  const answers = session.responses?.answers ?? {};

  if (!category) {
    redirect("/portal");
  }

  const { low, high } = estimateQuote(category.key, answers);

  return (
    <div className="as-skin">
      <main className="case-shell">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="eyebrow">Your Estimate</div>
          <h1>{category.label} Coverage</h1>

          <div className="quote-box">
            <div className="quote-amount">
              ${low}–${high}
              <span className="quote-period">/mo</span>
            </div>
            <p className="small" style={{ color: "var(--slate-light)" }}>
              Illustrative placeholder estimate only — not a final rate. Your specialist,{" "}
              {session.specialist_name ?? "your assigned specialist"}, will confirm exact pricing and
              coverage limits.
            </p>
          </div>

          <Link href="/portal" className="btn btn-outline btn-block" style={{ marginTop: 24 }}>
            Explore Another Category
          </Link>
        </div>
      </main>
    </div>
  );
}