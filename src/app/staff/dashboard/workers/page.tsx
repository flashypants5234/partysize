import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createWorkerAccount, deactivateWorker } from "../actions";

export default async function WorkersPage() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") {
    redirect("/staff/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data: workers } = await supabase
    .from("staff_profiles")
    .select("id, role, display_name, active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Workers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create and manage worker accounts. Admin-only.
      </p>

      <form
        action={createWorkerAccount}
        className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"
      >
        <input
          name="username"
          placeholder="Username"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Temporary password"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="display_name"
          placeholder="Display name (optional)"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 sm:col-span-3"
        >
          Create Worker Account
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(workers ?? []).map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {w.display_name ?? "—"}
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">{w.role}</td>
                <td className="px-4 py-3">
                  {w.active ? (
                    <span className="text-green-700">Active</span>
                  ) : (
                    <span className="text-slate-400">Deactivated</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {w.role === "worker" && w.active && (
                    <form action={deactivateWorker.bind(null, w.id)}>
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Deactivate
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
