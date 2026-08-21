"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStaffSession } from "@/hooks/useStaffSession";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import NotAuthorized from "@/components/staff/NotAuthorized";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPanelPage() {
  const { session, role, staffId, loading } = useStaffSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "worker") {
      router.replace("/404wrker-panel");
    }
  }, [loading, role, router]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!session) {
    return <StaffLoginForm />;
  }

  if (role === "worker") {
    return null;
  }

  if (role !== "admin") {
    return <NotAuthorized />;
  }

  return <AdminDashboard staffId={staffId!} />;
}