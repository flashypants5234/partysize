"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import CreateCaseForm from "@/components/staff/CreateCaseForm";
import WorkerCasesTable from "@/components/staff/WorkerCasesTable";
import QuoteRequestsBanner from "./QuoteRequestsBanner";
import QuotePresetsPanel from "./QuotePresetsPanel";
import WorkersPanel from "./WorkersPanel";
import LoginActivityPanel from "./LoginActivityPanel";
import ActiveSessionsPanel from "./ActiveSessionsPanel";
import AdminSeedsPanel from "./AdminSeedsPanel";
import SiteTextPanel from "./SiteTextPanel";

const TABS = ["cases", "sessions", "quotes", "workers", "activity", "seeds", "content"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  cases: "All Cases",
  sessions: "Active Sessions",
  quotes: "Quotes",
  workers: "Workers",
  activity: "Login Activity",
  seeds: "Admin Seeds",
  content: "Site Text",
};

export default function AdminDashboard({ staffId }: { staffId: string }) {
  const [tab, setTab] = useState<Tab>("cases");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/404wrker-panel"
            className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
          >
            Worker Panel
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      </div>

      <QuoteRequestsBanner staffId={staffId} />

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "cases" && (
        <div className="space-y-6">
          <CreateCaseForm
            staffId={staffId}
            isAdmin
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
          <WorkerCasesTable staffId={staffId} isAdmin refreshKey={refreshKey} />
        </div>
      )}
      {tab === "sessions" && <ActiveSessionsPanel />}
      {tab === "quotes" && <QuotePresetsPanel />}
      {tab === "workers" && <WorkersPanel />}
      {tab === "activity" && <LoginActivityPanel />}
      {tab === "seeds" && <AdminSeedsPanel staffId={staffId} />}
      {tab === "content" && <SiteTextPanel staffId={staffId} />}
    </div>
  );
}