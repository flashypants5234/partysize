"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from "@/lib/rateLimit";
import CaseQuotePanel from "@/components/admin/CaseQuotePanel";
import type { CaseRow, NoteRow, OnboardingResponseRow } from "@/types/staff";

export default function CaseDetailPanel({
  caseRow,
  staffId,
  isAdmin,
  onChange,
}: {
  caseRow: CaseRow;
  staffId: string;
  isAdmin: boolean;
  onChange: () => void;
}) {
  const [specialistName, setSpecialistName] = useState(caseRow.specialist_name ?? "");
  const [protectedPartyName, setProtectedPartyName] = useState(caseRow.protected_party_name ?? "");
  const [caseOverview, setCaseOverview] = useState(caseRow.case_overview ?? "");
  const [clientStatus, setClientStatus] = useState(caseRow.client_status);
  const [caseNotes, setCaseNotes] = useState(caseRow.notes ?? "");
  const [onboardingEnabled, setOnboardingEnabled] = useState(caseRow.onboarding_enabled);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [newNote, setNewNote] = useState("");
  const [responses, setResponses] = useState<OnboardingResponseRow[]>([]);

  const guardSave = useRateLimit();
  const guardNote = useRateLimit();

  const canEdit = isAdmin || caseRow.assigned_staff_id === staffId;

  const loadExtras = () => {
    supabase
      .from("worker_case_notes")
      .select("*")
      .eq("case_id", caseRow.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setNotes((data as NoteRow[]) ?? []));

    supabase
      .from("onboarding_responses")
      .select("*")
      .eq("case_id", caseRow.id)
      .order("submitted_at", { ascending: false })
      .then(({ data }) => setResponses((data as OnboardingResponseRow[]) ?? []));
  };

  useEffect(() => {
    loadExtras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseRow.id]);

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!guardSave()) {
      setError("Please slow down before saving again.");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase
      .from("case_ids")
      .update({
        specialist_name: specialistName || null,
        protected_party_name: protectedPartyName || null,
        case_overview: caseOverview || null,
        client_status: clientStatus,
        notes: caseNotes || null,
      })
      .eq("id", caseRow.id);
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccessMessage(
      `Case located successfully\nassigned specialist: ${specialistName || "—"}\nprotected party: ${
        protectedPartyName || "—"
      }\nCase Overview: ${caseOverview || "—"}\nstatus: ${clientStatus}\ncase notes: ${
        caseNotes || "—"
      }`
    );
    onChange();
  };

  const handleToggleOnboarding = async () => {
    const next = !onboardingEnabled;
    setOnboardingEnabled(next);
    await supabase.from("case_ids").update({ onboarding_enabled: next }).eq("id", caseRow.id);
    onChange();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    if (!guardNote()) {
      setError("Please slow down before adding another note.");
      return;
    }
    const { error: noteError } = await supabase.from("worker_case_notes").insert({
      case_id: caseRow.id,
      staff_id: staffId,
      note: newNote.trim(),
    });
    if (noteError) {
      setError(noteError.message);
      return;
    }
    setNewNote("");
    loadExtras();
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {!canEdit && (
        <p className="rounded bg-yellow-100 px-3 py-2 text-sm text-yellow-800">
          Read-only: this case is assigned to another specialist.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Assigned Specialist</label>
          <input
            value={specialistName}
            disabled={!canEdit}
            onChange={(e) => setSpecialistName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Protected Party</label>
          <input
            value={protectedPartyName}
            disabled={!canEdit}
            onChange={(e) => setProtectedPartyName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Case Overview</label>
          <textarea
            value={caseOverview}
            disabled={!canEdit}
            onChange={(e) => setCaseOverview(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <input
            value={clientStatus}
            disabled={!canEdit}
            onChange={(e) => setClientStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Case Notes</label>
          <textarea
            value={caseNotes}
            disabled={!canEdit}
            onChange={(e) => setCaseNotes(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={onboardingEnabled}
          disabled={!canEdit}
          onChange={handleToggleOnboarding}
        />
        Onboarding questionnaire enabled
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {canEdit && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Case Profile"}
        </button>
      )}

      {successMessage && (
        <pre className="whitespace-pre-wrap rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </pre>
      )}

      {isAdmin && <CaseQuotePanel caseId={caseRow.id} staffId={staffId} />}

      <div>
        <h3 className="mb-2 font-semibold">Client Onboarding Responses</h3>
        {responses.length === 0 ? (
          <p className="text-sm text-gray-500">No responses submitted yet.</p>
        ) : (
          <div className="space-y-2">
            {responses.map((r) => (
              <div key={r.id} className="rounded-md bg-white p-3 ring-1 ring-gray-200">
                <p className="mb-1 text-xs text-gray-400">
                  Submitted {new Date(r.submitted_at).toLocaleString()}
                </p>
                <dl className="space-y-1 text-sm">
                  {Object.entries(r.responses).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="font-medium capitalize">{k.replace(/_/g, " ")}:</dt>
                      <dd className="text-gray-700">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Private Notes (you + admin only)</h3>
        <div className="mb-3 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-md bg-white p-2 text-sm ring-1 ring-gray-200">
              {n.note}
              <div className="mt-1 text-xs text-gray-400">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          {notes.length === 0 && <p className="text-sm text-gray-500">No private notes yet.</p>}
        </div>
        <div className="flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a private note…"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            onClick={handleAddNote}
            className="rounded-md bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-900"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}