"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

const QUESTIONS = [
  { key: "incident_type", label: "What type of incident are you reporting?" },
  { key: "incident_date", label: "When did the incident occur?" },
  { key: "property_impact", label: "Describe the property or damage involved." },
  { key: "desired_outcome", label: "What outcome are you hoping for?" },
];

export default function OnboardingQuestionnaire({
  token,
  onComplete,
}: {
  token: string;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc("submit_onboarding", {
      p_token: token,
      p_responses: answers,
    });
    setLoading(false);
    if (rpcError || data === false) {
      setError("Could not submit your responses. Please try again.");
      return;
    }
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Case Questionnaire</h2>
      <p className="text-sm text-gray-600">
        Please answer the questions below so your specialist can prepare your case.
      </p>
      {QUESTIONS.map((q) => (
        <div key={q.key}>
          <label className="mb-1 block text-sm font-medium">{q.label}</label>
          <textarea
            required
            rows={2}
            value={answers[q.key] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Responses"}
      </button>
    </form>
  );
}