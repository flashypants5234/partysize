import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSeedsPage() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") {
    redirect("/staff/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data: seeds } = await supabase
    .from("case_ids")
    .select("id, code, email, phone, status, notes, created_at")
    .eq("is_admin_seed", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Admin Seeds</h1>
      <p className="mt-1 text-sm text-slate-500">
        Case IDs flagged as admin-only. These never appear in worker views, tables, or logs.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(seeds ?? []).map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{s.code}</td>
                <td className="px-4 py-3 text-slate-600">{s.email || s.phone || "—"}</td>
                <td className="px-4 py-3 capitalize text-slate-600">{s.status}</td>
                <td className="px-4 py-3 text-slate-500">{s.notes || "—"}</td>
              </tr>
            ))}
            {(!seeds || seeds.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No admin seeds yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
