"use client";

import { useState } from "react";
import CreateCaseForm from "@/components/staff/CreateCaseForm";
import CasesList from "@/components/staff/CasesList";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSeedsPanel({ staffId }: { staffId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSeed = async () => {
    // Admin seed cases are marked separately; convert the last-created case for this admin.
    await supabase
      .from("case_ids")
      .update({ is_admin_seed: true })
      .eq("created_by", staffId)
      .eq("is_admin_seed", false)
      .order("created_at", { ascending: false })
      .limit(1);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Seed cases are admin-only test cases, separate from real client cases.
      </p>
      <CreateCaseForm
        staffId={staffId}
        isAdmin
        onCreated={handleCreateSeed}
      />
      <CasesList staffId={staffId} isAdmin includeAdminSeeds refreshKey={refreshKey} />
    </div>
  );
}