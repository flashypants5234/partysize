import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCaseId, toggleOnboarding } from "./actions";

export default async function CaseIdsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: caseIds } = await supabase
    .from("case_ids")
    .select("id, code, email, phone, onboarding_enabled, is_admin_seed, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Case IDs</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create Case IDs for beta clients and control whether they see the onboarding
        questionnaire.
      </p>

      <form
        action={createCaseId}
        className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          name="code"
          placeholder="Case ID (e.g. CASE-1029)"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="onboarding_enabled" className="h-4 w-4 accent-accent-500" />
            Onboarding
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="is_admin_seed" className="h-4 w-4 accent-accent-500" />
            Admin seed
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 sm:col-span-2 lg:col-span-4"
        >
          Create Case ID
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Onboarding</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(caseIds ?? []).map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {c.code}
                  {c.is_admin_seed && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                      Admin Seed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {c.email || c.phone || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 capitalize">{c.status}</td>
                <td className="px-4 py-3">
                  {c.onboarding_enabled ? (
                    <span className="text-green-700">Enabled</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={toggleOnboarding.bind(null, c.id, !c.onboarding_enabled)}>
                    <button type="submit" className="text-xs font-semibold text-accent-600 hover:underline">
                      {c.onboarding_enabled ? "Disable" : "Enable"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!caseIds || caseIds.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No Case IDs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
