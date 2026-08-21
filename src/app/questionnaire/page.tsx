import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { getCategory } from "@/data/coverage-categories";
import QuestionnaireWizard from "./QuestionnaireWizard";

export default async function QuestionnairePage() {
  const session = await getCaseSession();

  if (!session) {
    redirect("/access");
  }

  if (!session.onboarding_enabled) {
    redirect("/review");
  }

  if (!session.selected_category) {
    redirect("/portal");
  }

  const category = getCategory(session.selected_category);

  if (!category) {
    redirect("/portal");
  }

  return <QuestionnaireWizard category={category} />;
}