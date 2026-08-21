"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteRow, QuotePresetRow } from "@/types/staff";

export default function CaseQuotePanel({
  caseId,
  staffId,
}: {
  caseId: string;
  staffId: string;
}) {
  const [quote, setQuote] = useState<QuoteRow | null>(null);
  const [presets, setPresets] = useState<QuotePresetRow[]>([]);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("case_quotes")
      .select("*")
      .eq("case_id", caseId)
      .maybeSingle();
    setQuote((data as QuoteRow) ?? null);
    setText((data as QuoteRow)?.quote_text ?? "");
  };

  useEffect(() => {
    load();
    supabase
      .from("quote_presets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPresets((data as QuotePresetRow[]) ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const handleIssue = async () => {
    if (!text.trim()) {
      setError("Quote text cannot be empty.");
      return;
    }
    setError(null);
    setSaving(true);
    const { error: upsertError } = await supabase.from("case_quotes").upsert(
      {
        case_id: caseId,
        quote_text: text.trim(),
        issued_at: new Date().toISOString(),
        issued_by: staffId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "case_id" }
    );
    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    load();
  };

  return (
    <div className="space-y-3 rounded-lg border-2 border-purple-300 bg-purple-50 p-4">
      <h3 className="font-semibold text-purple-800">
        Confidential Quote (admin & client only)
      </h3>

      {quote?.requested_at && !quote.issued_at && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
          ⚠ Client requested a quote on {new Date(quote.requested_at).toLocaleString()}
        </p>
      )}

      {quote?.issued_at && (
        <p className="text-sm text-gray-600">
          Issued {new Date(quote.issued_at).toLocaleString()} —{" "}
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-purple-700 hover:underline"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
        </p>
      )}

      {presets.length > 0 && (
        <select
          onChange={(e) => {
            const p = presets.find((x) => x.id === e.target.value);
            if (p) setText(p.quote_text);
          }}
          defaultValue=""
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Insert a preset quote…</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={revealed || !quote?.issued_at ? text : "•••••••••••••••••••••"}
        onChange={(e) => setText(e.target.value)}
        disabled={!!quote?.issued_at && !revealed}
        rows={3}
        placeholder="Type the confidential quote to relay securely to the client…"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleIssue}
        disabled={saving}
        className="rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-60"
      >
        {saving ? "Issuing…" : quote?.issued_at ? "Update Quote" : "Issue Quote to Client"}
      </button>
    </div>
  );
}