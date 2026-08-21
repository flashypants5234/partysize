"use client";

interface CaseLocatedCardProps {
  specialistName: string | null;
  protectedPartyName: string | null;
  caseCode: string;
  clientStatus: string;
  caseOverview: string | null;
  caseNotes: string | null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-base text-gray-900">{value}</dd>
    </div>
  );
}

export default function CaseLocatedCard({
  specialistName,
  protectedPartyName,
  caseCode,
  clientStatus,
  caseOverview,
  caseNotes,
}: CaseLocatedCardProps) {
  return (
    <div className="rounded-lg border border-green-300 bg-white p-6 shadow-sm">
      <p className="mb-6 text-lg font-semibold text-green-700">✓ Case located successfully</p>
      <dl className="grid gap-5 sm:grid-cols-2">
        <Field label="Assigned Specialist" value={specialistName || "Unassigned"} />
        <Field label="Protected Party" value={protectedPartyName || "—"} />
        <Field label="Case ID" value={caseCode} />
        <Field label="Status" value={clientStatus} />
        <div className="sm:col-span-2">
          <Field label="Case Overview" value={caseOverview || "No overview on file."} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Case Notes" value={caseNotes || "No notes on file."} />
        </div>
      </dl>
    </div>
  );
}