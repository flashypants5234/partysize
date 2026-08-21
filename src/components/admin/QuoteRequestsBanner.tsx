"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { unwrap } from "@/types/staff";

interface PendingQuote {
  id: string;
  case_id: string;
  requested_at: string;
  code: string;
}

export default function QuoteRequestsBanner({ staffId }: { staffId: string }) {
  const [pending, setPending] = useState<PendingQuote[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("case_quotes")
      .select("id, case_id, requested_at, case_ids(code)")
      .not("requested_at", "is", null)
      .is("issued_at", null)
      .then(({ data }) => {
        const rows = (data ?? []).map((r: any) => ({
          id: r.id,
          case_id: r.case_id,
          requested_at: r.requested_at,
          code: unwrap<{ code: string }>(r.case_ids)?.code ?? "unknown",
        }));
        setPending(rows);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleIssue = async (quoteId: string, caseId: string) => {
    const text = drafts[quoteId]?.trim();
    if (!text) {
      setError("Enter the quote text before issuing.");
      return;
    }
    setError(null);
    const { error: updateError } = await supabase
      .from("case_quotes")
      .update({ quote_text: text, issued_at: new Date().toISOString(), issued_by: staffId })
      .eq("id", quoteId)
      .eq("case_id", caseId);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDrafts((d) => ({ ...d, [quoteId]: "" }));
    load();
  };

  if (pending.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border-2 border-red-400 bg-red-50 p-4">
      <h2 className="text-lg font-bold text-red-700">⚠ Clients Waiting on a Quote</h2>
      {error && (
        <p className="text-sm text-red-700" data-no-edit>
          {error}
        </p>
      )}
      {pending.map((p) => (
        <div key={p.id} className="rounded-md bg-white p-3 ring-1 ring-red-200" data-no-edit>
          <p className="mb-2 text-sm font-medium">
            Case <span className="font-mono">{p.code}</span> — requested{" "}
            {new Date(p.requested_at).toLocaleString()}
          </p>
          <textarea
            value={drafts[p.id] ?? ""}
            onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
            placeholder="Type the confidential quote text here…"
            rows={2}
            className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={() => handleIssue(p.id, p.case_id)}
            className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Issue Quote to Client
          </button>
        </div>
      ))}
    </div>
  );
}