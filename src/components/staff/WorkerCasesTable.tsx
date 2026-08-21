"use client";

import { useCallback, useEffect, useState, Fragment } from "react";
import { supabase } from "@/integrations/supabase/client";
import CaseDetailPanel from "./CaseDetailPanel";
import type { CaseRow, CaseSessionRow } from "@/types/staff";

function isLive(lastActivity: string) {
  return Date.now() - new Date(lastActivity).getTime() < 2 * 60 * 1000;
}

export default function WorkerCasesTable({
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
  const [sessions, setSessions] = useState<Record<string, CaseSessionRow>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("case_ids")
      .select("*")
      .eq("is_admin_seed", includeAdminSeeds)
      .order("created_at", { ascending: false });

    const rows = (data as CaseRow[]) ?? [];
    setCases(rows);

    if (rows.length === 0) {
      setSessions({});
      return;
    }

    const { data: sessionData } = await supabase
      .from("case_sessions")
      .select("*")
      .in(
        "case_id",
        rows.map((r) => r.id),
      )
      .order("last_activity_at", { ascending: false });

    // The query is sorted newest-first, so the first row per case wins.
    const latest: Record<string, CaseSessionRow> = {};
    for (const s of (sessionData as CaseSessionRow[]) ?? []) {
      if (!latest[s.case_id]) latest[s.case_id] = s;
    }
    setSessions(latest);
  }, [includeAdminSeeds]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, [load, refreshKey]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Case ID</th>
            <th className="px-4 py-2">Protected Party</th>
            <th className="px-4 py-2">Specialist</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Questionnaire</th>
            <th className="px-4 py-2">Step</th>
            <th className="px-4 py-2">Last Seen</th>
            <th className="px-4 py-2">Current Page</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200" data-no-edit>
          {cases.map((c) => {
            const session = sessions[c.id];
            const online = session && !session.ended_at && isLive(session.last_activity_at);
            return (
              <Fragment key={c.id}>
                <tr className="align-top">
                  <td className="px-4 py-2 font-mono">{c.code}</td>
                  <td className="px-4 py-2">{c.protected_party_name ?? "—"}</td>
                  <td className="px-4 py-2">{c.specialist_name ?? "—"}</td>
                  <td className="px-4 py-2">{c.client_status}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.onboarding_enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.onboarding_enabled ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {session ? session.current_step.replace(/_/g, " ") : "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {online ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Online now
                      </span>
                    ) : session ? (
                      new Date(session.last_activity_at).toLocaleString()
                    ) : (
                      "Never"
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{session?.current_page ?? "—"}</td>
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
                    <td colSpan={9} className="bg-gray-50 px-2 py-4 sm:px-4">
                      <CaseDetailPanel
                        caseRow={c}
                        staffId={staffId}
                        isAdmin={isAdmin}
                        onChange={load}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {cases.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                No case profiles yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
