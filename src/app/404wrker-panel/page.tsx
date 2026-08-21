"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStaffSession } from "@/hooks/useStaffSession";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import NotAuthorized from "@/components/staff/NotAuthorized";
import WorkerDashboard from "@/components/worker/WorkerDashboard";

export default function WorkerPanelPage() {
  const { session, role, staffId, loading } = useStaffSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "admin") {
      router.replace("/808admin-panel");
    }
  }, [loading, role, router]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!session) {
    return <StaffLoginForm />;
  }

  if (role !== "worker" && role !== "admin") {
    return <NotAuthorized />;
  }

  if (role === "admin") {
    return null;
  }

  return <WorkerDashboard staffId={staffId!} />;
}