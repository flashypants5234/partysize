"use client";

import { useStaffSession } from "@/hooks/useStaffSession";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import NotAuthorized from "@/components/staff/NotAuthorized";
import WrongPanel from "@/components/staff/WrongPanel";
import WorkerDashboard from "@/components/worker/WorkerDashboard";

export default function WorkerPanelPage() {
  const { session, role, staffId, loading } = useStaffSession();

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!session) {
    return <StaffLoginForm />;
  }

  if (role === "admin") {
    return <WrongPanel requiredRole="worker" />;
  }

  if (role !== "worker" || !staffId) {
    return <NotAuthorized />;
  }

  return <WorkerDashboard staffId={staffId} />;
}