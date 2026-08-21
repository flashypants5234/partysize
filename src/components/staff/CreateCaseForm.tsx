"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from "@/lib/rateLimit";

interface WorkerOption {
  id: string;
  display_name: string | null;
}

export const CLIENT_STATUSES = ["Active", "Pending", "Under Review", "Completed"] as const;

const fieldClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export default function CreateCaseForm({
  staffId,
  isAdmin,
  onCreated,
}: {
  staffId: string;
  isAdmin: boolean;
  onCreated: () => void;
}) {
  const [code, setCode] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [protectedPartyName, setProtectedPartyName] = useState("");
  const [clientStatus, setClientStatus] = useState<string>("Active");
  const [caseOverview, setCaseOverview] = useState("");
  const [caseNotes, setCaseNotes] = useState("");
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [assignedStaffId, setAssignedStaffId] = useState(staffId);

  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [codeTaken, setCodeTaken] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
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

  const checkCodeAvailability = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setCodeTaken(false);
      return;
    }
    setCheckingCode(true);
    const { data } = await supabase
      .from("case_ids")
      .select("id")
      .eq("code", trimmed)
      .maybeSingle();
    setCheckingCode(false);
    setCodeTaken(Boolean(data));
  };

  const resetForm = () => {
    setCode("");
    setSpecialistName("");
    setProtectedPartyName("");
    setClientStatus("Active");
    setCaseOverview("");
    setCaseNotes("");
    setOnboardingEnabled(true);
    setAssignedStaffId(staffId);
    setCodeTaken(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("A Case ID is required.");
      return;
    }

    if (!guard()) {
      setError("Please slow down — you're issuing cases too quickly.");
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase.from("case_ids").insert({
      code: trimmedCode,
      specialist_name: specialistName.trim() || null,
      protected_party_name: protectedPartyName.trim() || null,
      client_status: clientStatus,
      case_overview: caseOverview.trim() || null,
      notes: caseNotes.trim() || null,
      onboarding_enabled: onboardingEnabled,
      assigned_staff_id: assignedStaffId,
      created_by: staffId,
    });
    setLoading(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setCodeTaken(true);
        setError(`Case ID "${trimmedCode}" is already taken. Choose a different one.`);
      } else {
        setError(insertError.message);
      }
      return;
    }

    setSuccess(`Case profile "${trimmedCode}" created successfully.`);
    resetForm();
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Create Case Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          The Case ID and case profile are created together. The details below appear to your client
          in their &ldquo;Case located successfully&rdquo; panel.
        </p>
      </div>

      <div>
        <label htmlFor="case-code" className={labelClass}>
          Case ID <span className="text-red-600">*</span>
        </label>
        <input
          id="case-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setCodeTaken(false);
          }}
          onBlur={checkCodeAvailability}
          required
          placeholder="e.g. tempcase1"
          className={`${fieldClass} font-mono ${codeTaken ? "border-red-500" : ""}`}
        />
        {checkingCode && <p className="mt-1 text-xs text-gray-500">Checking availability…</p>}
        {codeTaken && (
          <p className="mt-1 text-xs text-red-600">
            That Case ID is already taken. Choose a different one.
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">This is the code you give the client to log in.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="specialist" className={labelClass}>
            Assigned Specialist
          </label>
          <input
            id="specialist"
            value={specialistName}
            onChange={(e) => setSpecialistName(e.target.value)}
            placeholder="Name shown to the client"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="protected-party" className={labelClass}>
            Protected Party
          </label>
          <input
            id="protected-party"
            value={protectedPartyName}
            onChange={(e) => setProtectedPartyName(e.target.value)}
            placeholder="Client name"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="client-status" className={labelClass}>
            Status
          </label>
          <select
            id="client-status"
            value={clientStatus}
            onChange={(e) => setClientStatus(e.target.value)}
            className={fieldClass}
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {isAdmin && (
          <div>
            <label htmlFor="assign-to" className={labelClass}>
              Assign To
            </label>
            <select
              id="assign-to"
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className={fieldClass}
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
      </div>

      <div>
        <label htmlFor="case-overview" className={labelClass}>
          Case Overview
        </label>
        <textarea
          id="case-overview"
          value={caseOverview}
          onChange={(e) => setCaseOverview(e.target.value)}
          rows={3}
          placeholder="Shown to the client on their case panel."
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="case-notes" className={labelClass}>
          Case Notes
        </label>
        <textarea
          id="case-notes"
          value={caseNotes}
          onChange={(e) => setCaseNotes(e.target.value)}
          rows={3}
          placeholder="Shown to the client on their case panel."
          className={fieldClass}
        />
      </div>

      <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
        <input
          type="checkbox"
          checked={onboardingEnabled}
          onChange={(e) => setOnboardingEnabled(e.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        <span className="text-sm">
          <span className="font-medium">Enable client questionnaire</span>
          <span className="block text-gray-500">
            On by default. When off, the client goes straight from category selection to their
            protection review.
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading || codeTaken}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Creating…" : "Create Case Profile"}
      </button>
    </form>
  );
}
