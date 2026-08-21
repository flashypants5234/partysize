"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuoteData {
  quote_text: string | null;
  requested_at: string | null;
  issued_at: string | null;
}

export default function QuoteSection({ token }: { token: string }) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase.rpc("get_case_quote", { p_token: token });
    const rows = (data ?? []) as QuoteData[];
    setQuote(rows[0] ?? null);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRequest = async () => {
    setLoading(true);
    await supabase.rpc("request_quote", { p_token: token });
    await load();
    setLoading(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-semibold">Your Insurance Quote</h2>

      {quote?.issued_at && quote.quote_text ? (
        <div className="rounded-md border border-green-300 bg-green-50 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-green-700">
            Confidential quote — for your eyes only
          </p>
          <p className="whitespace-pre-wrap text-gray-900">{quote.quote_text}</p>
        </div>
      ) : quote?.requested_at ? (
        <p className="text-sm text-gray-600">
          Your quote request was received on{" "}
          {new Date(quote.requested_at).toLocaleString()}. Your specialist is preparing it now —
          this page will update automatically.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-600">
            Request a custom insurance quote for your case. It will be delivered here privately.
          </p>
          <button
            onClick={handleRequest}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Requesting…" : "Request My Quote"}
          </button>
        </>
      )}
    </div>
  );
}