"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CaseDetailPanel from "./CaseDetailPanel";
import type { CaseRow } from "@/types/staff";

export default function CasesList({
  staffId,
  isAdmin,
  includeAdminSeeds = false,
  refreshKey,
}: {
  staffId: string;
  isAdmin: boolean;
  includeAdminSeeds?: boolean;
  refreshKey: number;
}) {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("case_ids")
      .select("*")
      .eq("is_admin_seed", includeAdminSeeds)
      .order("created_at", { ascending: false })
      .then(({ data }) => setCases((data as CaseRow[]) ?? []));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Protected Party</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Onboarding</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cases.map((c) => (
            <>
              <tr key={c.id}>
                <td className="px-4 py-2 font-mono">{c.code}</td>
                <td className="px-4 py-2">{c.protected_party_name ?? "—"}</td>
                <td className="px-4 py-2">{c.client_status}</td>
                <td className="px-4 py-2">{c.onboarding_enabled ? "On" : "Off"}</td>
                <td className="px-4 py-2">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {expandedId === c.id ? "Close" : "Open"}
                  </button>
                </td>
              </tr>
              {expandedId === c.id && (
                <tr>
                  <td colSpan={6} className="bg-gray-50 px-4 py-4">
                    <CaseDetailPanel caseRow={c} staffId={staffId} onChange={load} />
                  </td>
                </tr>
              )}
            </>
          ))}
          {cases.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                No cases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}