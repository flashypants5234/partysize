"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import CreateCaseForm from "@/components/staff/CreateCaseForm";
import WorkerCasesTable from "@/components/staff/WorkerCasesTable";

interface RecentActivity {
  code: string;
  client_status: string;
  onboarding_enabled: boolean;
  created_at: string;
}

export default function WorkerDashboard({
  staffId,
  isAdmin = false,
}: {
  staffId: string;
  isAdmin?: boolean;
}) {
  const [tab, setTab] = useState<"cases" | "activity">("cases");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activity, setActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (tab !== "activity") return;
    supabase.rpc("list_recent_case_activity").then(({ data }) => {
      setActivity((data as RecentActivity[]) ?? []);
    });
  }, [tab]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          Worker Dashboard{isAdmin && <span className="ml-2 text-sm font-normal text-blue-600">(admin view)</span>}
        </h1>
        <div className="flex gap-2">
          {isAdmin && (
            <Link
              href="/808admin-panel"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(["cases", "activity"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            {t === "cases" ? (isAdmin ? "All Cases" : "My Cases") : "Recent Activity"}
          </button>
        ))}
      </div>

      {tab === "cases" && (
        <div className="space-y-6">
          <CreateCaseForm
            staffId={staffId}
            isAdmin={isAdmin}
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
          <WorkerCasesTable staffId={staffId} isAdmin={isAdmin} refreshKey={refreshKey} />
        </div>
      )}

      {tab === "activity" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Onboarding</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activity.map((a) => (
                <tr key={a.code}>
                  <td className="px-4 py-2 font-mono">{a.code}</td>
                  <td className="px-4 py-2">{a.client_status}</td>
                  <td className="px-4 py-2">{a.onboarding_enabled ? "On" : "Off"}</td>
                  <td className="px-4 py-2">{new Date(a.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {activity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No recent activity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}