"use client";

import { useStaffSession } from "@/hooks/useStaffSession";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import NotAuthorized from "@/components/staff/NotAuthorized";
import WorkerDashboard from "@/components/worker/WorkerDashboard";

export default function WorkerPanelPage() {
  const { session, role, staffId, loading } = useStaffSession();

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!session) {
    return <StaffLoginForm />;
  }

  if ((role !== "worker" && role !== "admin") || !staffId) {
    return <NotAuthorized />;
  }

  return <WorkerDashboard staffId={staffId} isAdmin={role === "admin"} />;
}