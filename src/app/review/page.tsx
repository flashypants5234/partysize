import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { getCategory } from "@/data/coverage-categories";
import { confirmReview } from "./actions";
import TrackPage from "@/components/portal/TrackPage";

export default async function ReviewPage() {
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

  return (
    <div className="as-skin">
      <TrackPage path="/review" />
      <main className="case-shell">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow">New Asset Protection Review</div>
          <h1>{category.label}</h1>
          <p className="hero-lede">Please confirm the details below before we issue your quote.</p>

          <div className="review-list" data-no-edit>
            {category.questions.map((q) => (
              <div key={q.key} className="review-row">
                <span className="review-q">{q.label}</span>
                <span className="review-a">{answers[q.key] ?? "Not answered"}</span>
              </div>
            ))}
          </div>

          <form action={confirmReview}>
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
              Get My Quote
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}