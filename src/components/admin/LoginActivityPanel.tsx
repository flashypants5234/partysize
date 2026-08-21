"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LoginActivityRow } from "@/types/staff";

export default function LoginActivityPanel() {
  const [rows, setRows] = useState<LoginActivityRow[]>([]);

  useEffect(() => {
    supabase
      .from("staff_login_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setRows((data as LoginActivityRow[]) ?? []));
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Identifier</th>
            <th className="px-4 py-2">Success</th>
            <th className="px-4 py-2">IP</th>
            <th className="px-4 py-2">User Agent</th>
            <th className="px-4 py-2">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200" data-no-edit>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.attempted_identifier ?? "—"}</td>
              <td className={`px-4 py-2 ${r.success ? "text-green-600" : "text-red-600"}`}>
                {r.success ? "Success" : "Failed"}
              </td>
              <td className="px-4 py-2 font-mono">{r.ip_address ?? "—"}</td>
              <td className="max-w-xs truncate px-4 py-2">{r.user_agent ?? "—"}</td>
              <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No login activity recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}