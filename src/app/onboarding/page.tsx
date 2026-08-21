import { redirect } from "next/navigation";
import { getCaseSession } from "@/lib/case-session";
import { markOnboardingInProgress } from "./actions";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const session = await getCaseSession();

  if (!session) {
    redirect("/access");
  }

  if (session.current_step === "onboarding_completed" || session.current_step === "in_portal") {
    redirect("/portal");
  }

  if (session.current_step === "logged_in") {
    await markOnboardingInProgress();
  }

  return <OnboardingWizard />;
}
