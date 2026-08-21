"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from "@/lib/rateLimit";

interface WorkerOption {
  id: string;
  display_name: string | null;
}

function generateCaseCode() {
  return `CASE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function CreateCaseForm({
  staffId,
  isAdmin,
  onCreated,
}: {
  staffId: string;
  isAdmin: boolean;
  onCreated: () => void;
}) {
  const [protectedPartyName, setProtectedPartyName] = useState("");
  const [assignedStaffId, setAssignedStaffId] = useState(staffId);
  const [onboardingEnabled, setOnboardingEnabled] = useState(false);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const guard = useRateLimit();

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("staff_profiles")
      .select("id, display_name")
      .eq("active", true)
      .eq("banned", false)
      .then(({ data }) => setWorkers(data ?? []));
  }, [isAdmin]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!guard()) {
      setError("Please slow down — you're issuing cases too quickly.");
      return;
    }

    setLoading(true);
    const code = generateCaseCode();
    const { error: insertError } = await supabase.from("case_ids").insert({
      code,
      protected_party_name: protectedPartyName || null,
      assigned_staff_id: assignedStaffId,
      onboarding_enabled: onboardingEnabled,
      created_by: staffId,
    });
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(`Case ${code} issued successfully.`);
    setProtectedPartyName("");
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold">Issue New Case</h2>
      <div>
        <label className="mb-1 block text-sm font-medium">Protected Party Name (optional)</label>
        <input
          value={protectedPartyName}
          onChange={(e) => setProtectedPartyName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      {isAdmin && (
        <div>
          <label className="mb-1 block text-sm font-medium">Assign To</label>
          <select
            value={assignedStaffId}
            onChange={(e) => setAssignedStaffId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value={staffId}>Myself</option>
            {workers
              .filter((w) => w.id !== staffId)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.display_name ?? w.id}
                </option>
              ))}
          </select>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={onboardingEnabled}
          onChange={(e) => setOnboardingEnabled(e.target.checked)}
        />
        Enable onboarding questionnaire
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Issuing…" : "Issue Case"}
      </button>
    </form>
  );
}