import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCaseSession, CASE_SESSION_COOKIE } from "@/lib/case-session";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-navy-700 bg-navy-900 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
          <ShieldCheck className="h-6 w-6 text-accent-500" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-semibold">You&apos;re in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Welcome to the American Shield beta. Your account isn&apos;t set up as a full dashboard
          yet — this is a placeholder home while we build out the platform.
        </p>
        <div className="mt-6 rounded-md border border-navy-700 bg-navy-800 p-4 text-left text-sm text-slate-300">
          <p className="text-xs uppercase tracking-wide text-slate-500">What&apos;s next</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Our team will follow up using the contact info tied to your Case ID.</li>
            <li>Cryptocurrency coverage details are coming soon.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
