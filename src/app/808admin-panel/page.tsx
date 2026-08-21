import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  loginAdminPanel,
  logoutAdminPanel,
  createCaseId,
  toggleOnboardingAction,
  createAdminSeed,
  createWorkerAccount,
  deactivateWorker,
  banWorker,
  unbanWorker,
} from "./actions";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import NotAuthorized from "@/components/admin/NotAuthorized";
import QuoteRequestsPanel from "@/components/admin/QuoteRequestsPanel";
import CreateCasePanel from "@/components/admin/CreateCasePanel";
import AllCasesPanel from "@/components/admin/AllCasesPanel";
import ActiveSessionsPanel from "@/components/admin/ActiveSessionsPanel";
import WorkersPanel from "@/components/admin/WorkersPanel";
import LoginActivityPanel from "@/components/admin/LoginActivityPanel";
import AdminSeedsPanel from "@/components/admin/AdminSeedsPanel";
import type {
  CaseRow,
  CaseSessionRow,
  QuoteRequestRow,
  LoginActivityRow,
} from "@/components/admin/admin-types";

export default async function AdminPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return <AdminLoginForm error={error} action={loginAdminPanel} />;
  }

  const { data: role } = await supabase.rpc("current_staff_role");

  if (role !== "admin") {
    return <NotAuthorized logoutAction={logoutAdminPanel} />;
  }

  const { data: staffOptions } = await supabase
    .from("staff_profiles")
    .select("id, display_name, role")
    .eq("active", true)
    .order("display_name");

  const { data: caseIds } = await supabase
    .from("case_ids")
    .select(
      "id, code, email, onboarding_enabled, status, is_admin_seed, specialist_name, protected_party_name, case_overview, client_status, notes, created_at, staff_profiles!assigned_staff_id(display_name)"
    )
    .eq("is_admin_seed", false)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: adminSeeds } = await supabase
    .from("case_ids")
    .select("id, code, status, notes, created_at")
    .eq("is_admin_seed", true)
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: sessions } = await supabase
    .from("case_sessions")
    .select("id, current_step, started_at, last_activity_at, case_ids(code, email)")
    .order("last_activity_at", { ascending: false })
    .limit(30);

  const { data: workers } = await supabase
    .from("staff_profiles")
    .select("id, display_name, role, active, banned, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: quoteRequests } = await supabase
    .from("case_quotes")
    .select("case_id, requested_at, issued_at, case_ids(code, protected_party_name)")
    .not("requested_at", "is", null)
    .is("issued_at", null)
    .order("requested_at", { ascending: true });

  const { data: loginActivity } = await supabase
    .from("staff_login_activity")
    .select("id, attempted_identifier, ip_address, success, created_at, staff_profiles(display_name)")
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className="as-skin">
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h1>Admin Dashboard</h1>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/808admin-panel/presets" className="btn btn-outline btn-sm">
                Quote Presets
              </Link>
              <form action={logoutAdminPanel}>
                <button type="submit" className="btn btn-outline btn-sm">
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {error && (
            <p className="form-note" style={{ color: "#B3261E" }}>
              {error}
            </p>
          )}

          <QuoteRequestsPanel quoteRequests={(quoteRequests as QuoteRequestRow[] | null) ?? []} />

          <CreateCasePanel staffOptions={staffOptions ?? []} action={createCaseId} />

          <AllCasesPanel
            cases={(caseIds ?? []) as unknown as CaseRow[]}
            toggleOnboardingAction={toggleOnboardingAction}
          />

          <ActiveSessionsPanel sessions={(sessions as CaseSessionRow[] | null) ?? []} />

          <WorkersPanel
            workers={workers ?? []}
            createWorkerAccount={createWorkerAccount}
            deactivateWorker={deactivateWorker}
            banWorker={banWorker}
            unbanWorker={unbanWorker}
          />

          <LoginActivityPanel loginActivity={(loginActivity as LoginActivityRow[] | null) ?? []} />

          <AdminSeedsPanel seeds={adminSeeds ?? []} createAdminSeed={createAdminSeed} />
        </div>
      </section>
    </main>
  );
}