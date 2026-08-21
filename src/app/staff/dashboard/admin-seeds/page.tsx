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
      <div className="app-topbar">
        <div>
          <h2 style={{ marginBottom: 2 }}>Admin Seeds</h2>
          <p className="small" style={{ margin: 0 }}>
            Case IDs flagged as admin-only. These never appear in worker views, tables, or logs.
          </p>
        </div>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {(seeds ?? []).map((s) => (
              <tr key={s.id}>
                <td>{s.code}</td>
                <td className="small">{s.email || s.phone || "—"}</td>
                <td className="small" style={{ textTransform: "capitalize" }}>
                  {s.status}
                </td>
                <td className="small">{s.notes || "—"}</td>
              </tr>
            ))}
            {(!seeds || seeds.length === 0) && (
              <tr>
                <td colSpan={4} className="empty-state">
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
