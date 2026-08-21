"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { unwrap } from "@/types/staff";

interface SessionRow {
  id: string;
  current_step: string;
  selected_category: string | null;
  last_activity_at: string;
  code: string;
}

export default function ActiveSessionsPanel() {
  const [rows, setRows] = useState<SessionRow[]>([]);

  useEffect(() => {
    supabase
      .from("case_sessions")
      .select("id, current_step, selected_category, last_activity_at, case_ids(code)")
      .is("ended_at", null)
      .order("last_activity_at", { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map((r: any) => ({
          id: r.id,
          current_step: r.current_step,
          selected_category: r.selected_category,
          last_activity_at: r.last_activity_at,
          code: unwrap<{ code: string }>(r.case_ids)?.code ?? "unknown",
        }));
        setRows(mapped);
      });
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Case</th>
            <th className="px-4 py-2">Step</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Last Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2 font-mono">{r.code}</td>
              <td className="px-4 py-2">{r.current_step}</td>
              <td className="px-4 py-2">{r.selected_category ?? "—"}</td>
              <td className="px-4 py-2">{new Date(r.last_activity_at).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No active client sessions.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}