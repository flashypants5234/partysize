import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCaseSession, CASE_SESSION_COOKIE } from "@/lib/case-session";
import { supabase } from "@/integrations/supabase/client";
import PortalShell from "@/components/PortalShell";

export default async function PortalPage() {
  const session = await getCaseSession();

  if (!session) {
    redirect("/access");
  }

  if (session.current_step === "logged_in") {
    const cookieStore = await cookies();
    const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;
    if (token) {
      await supabase.rpc("update_case_step", { p_token: token, p_step: "in_portal" });
    }
  }

  return <PortalShell currentStep={session.current_step} onboardingEnabled={session.onboarding_enabled} />;
}
