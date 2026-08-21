"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import CaseLocatedCard from "@/components/portal/CaseLocatedCard";
import OnboardingQuestionnaire from "@/components/portal/OnboardingQuestionnaire";
import QuoteSection from "@/components/portal/QuoteSection";

interface CaseSessionData {
  onboarding_enabled: boolean;
  current_step: string;
  selected_category: string | null;
  case_code: string;
  specialist_name: string | null;
  protected_party_name: string | null;
  case_overview: string | null;
  client_status: string;
  case_notes: string | null;
  responses: Record<string, unknown> | null;
}

const TOKEN_KEY = "case_session_token";

export default function PortalPage() {
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<CaseSessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const loadSession = async (sessionToken: string) => {
    const { data, error: rpcError } = await supabase.rpc("get_case_session", {
      p_token: sessionToken,
    });
    const rows = (data ?? []) as CaseSessionData[];
    if (rpcError || rows.length === 0) {
      window.localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setCaseData(null);
      return;
    }
    setCaseData(rows[0]);
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      loadSession(stored).finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: rpcError } = await supabase.rpc("validate_case_id", {
      p_code: code.trim(),
    });
    setLoading(false);

    const rows = (data ?? []) as { session_token: string; onboarding_enabled: boolean }[];
    if (rpcError || rows.length === 0) {
      setError("Case ID not found. Please check the code and try again.");
      return;
    }

    const newToken = rows[0].session_token;
    window.localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    await loadSession(newToken);
  };

  const handleExit = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCaseData(null);
    setCode("");
  };

  if (initializing) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading…</div>;
  }

  if (!token || !caseData) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
        <h1 className="mb-6 text-2xl font-semibold">Client Portal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="case-code" className="mb-1 block text-sm font-medium">
              Case ID
            </label>
            <input
              id="case-code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your case ID"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Locating case…" : "Access My Case"}
          </button>
        </form>
      </div>
    );
  }

  const needsOnboarding = caseData.onboarding_enabled && !caseData.responses;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Case</h1>
        <button
          onClick={handleExit}
          className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-300"
        >
          Exit
        </button>
      </div>

      <CaseLocatedCard
        specialistName={caseData.specialist_name}
        protectedPartyName={caseData.protected_party_name}
        caseCode={caseData.case_code}
        clientStatus={caseData.client_status}
        caseOverview={caseData.case_overview}
        caseNotes={caseData.case_notes}
      />

      {needsOnboarding ? (
        <OnboardingQuestionnaire token={token} onComplete={() => loadSession(token)} />
      ) : (
        <QuoteSection token={token} />
      )}
    </div>
  );
}