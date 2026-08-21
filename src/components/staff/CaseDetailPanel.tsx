"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from "@/lib/rateLimit";
import CaseQuotePanel from "@/components/admin/CaseQuotePanel";
import ClientActivityPanel from "./ClientActivityPanel";
import { CLIENT_STATUSES } from "./CreateCaseForm";
import type { CaseRow, NoteRow } from "@/types/staff";

type Tab = "profile" | "activity" | "notes";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Case Profile" },
  { key: "activity", label: "Client Activity" },
  { key: "notes", label: "Private Notes" },
];

const fieldClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100";

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
  const [tab, setTab] = useState<Tab>("profile");

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

  const guardSave = useRateLimit();
  const guardNote = useRateLimit();

  const canEdit = isAdmin || caseRow.assigned_staff_id === staffId;

  const loadNotes = () => {
    supabase
      .from("worker_case_notes")
      .select("*")
      .eq("case_id", caseRow.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setNotes((data as NoteRow[]) ?? []));
  };

  useEffect(() => {
    loadNotes();
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

    setSuccessMessage("Case profile saved. The client will see these details on their next visit.");
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
    loadNotes();
  };

  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {!canEdit && (
        <p className="rounded bg-yellow-100 px-3 py-2 text-sm text-yellow-800">
          Read-only: this case is assigned to another specialist.
        </p>
      )}

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600" data-no-edit>
          {error}
        </p>
      )}

      {tab === "profile" && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            These details appear to your client in their &ldquo;Case located successfully&rdquo;
            panel.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Case ID</label>
              <input value={caseRow.code} disabled className={`${fieldClass} font-mono`} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Assigned Specialist</label>
              <input
                value={specialistName}
                disabled={!canEdit}
                onChange={(e) => setSpecialistName(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Protected Party</label>
              <input
                value={protectedPartyName}
                disabled={!canEdit}
                onChange={(e) => setProtectedPartyName(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={clientStatus}
                disabled={!canEdit}
                onChange={(e) => setClientStatus(e.target.value)}
                className={fieldClass}
              >
                {[...CLIENT_STATUSES, clientStatus]
                  .filter((s, i, arr) => arr.indexOf(s) === i)
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Case Overview</label>
              <textarea
                value={caseOverview}
                disabled={!canEdit}
                onChange={(e) => setCaseOverview(e.target.value)}
                rows={3}
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Case Notes</label>
              <textarea
                value={caseNotes}
                disabled={!canEdit}
                onChange={(e) => setCaseNotes(e.target.value)}
                rows={2}
                className={fieldClass}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-white p-3">
            <input
              type="checkbox"
              checked={onboardingEnabled}
              disabled={!canEdit}
              onChange={handleToggleOnboarding}
              className="mt-0.5 h-4 w-4"
            />
            <span className="text-sm">
              <span className="font-medium">Client questionnaire enabled</span>
              <span className="block text-gray-500">
                When off, the client skips straight to their protection review.
              </span>
            </span>
          </label>

          {canEdit && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving…" : "Save Case Profile"}
            </button>
          )}

          {successMessage && (
            <p className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800" data-no-edit>
              {successMessage}
            </p>
          )}

          {isAdmin && <CaseQuotePanel caseId={caseRow.id} staffId={staffId} />}
        </div>
      )}

      {tab === "activity" && <ClientActivityPanel caseId={caseRow.id} />}

      {tab === "notes" && (
        <div>
          <h3 className="mb-2 font-semibold">Private Notes (you + admin only)</h3>
          <div className="mb-3 space-y-2" data-no-edit>
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
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a private note…"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddNote}
              className="rounded-md bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-900"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
