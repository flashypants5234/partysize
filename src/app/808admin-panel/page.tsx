"use client";

import { useStaffSession } from "@/hooks/useStaffSession";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import NotAuthorized from "@/components/staff/NotAuthorized";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPanelPage() {
  const { session, role, staffId, loading } = useStaffSession();

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!session) {
    return <StaffLoginForm />;
  }

  if (role !== "admin" || !staffId) {
    return <NotAuthorized />;
  }

  return <AdminDashboard staffId={staffId} />;
}