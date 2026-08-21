"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  CaseActivityEventRow,
  CaseSessionRow,
  OnboardingResponseRow,
} from "@/types/staff";

const EVENT_LABELS: Record<string, string> = {
  login: "Logged in",
  logout: "Logged out",
  page_view: "Viewed page",
  category_selected: "Selected coverage category",
  question_answered: "Answered a question",
  questionnaire_completed: "Completed questionnaire",
  quote_requested: "Requested a quote",
  quote_viewed: "Viewed issued quote",
  quote_pending_viewed: "Checked for pending quote",
};

const EVENT_TONE: Record<string, string> = {
  login: "bg-green-100 text-green-800",
  logout: "bg-gray-200 text-gray-700",
  question_answered: "bg-blue-100 text-blue-800",
  category_selected: "bg-indigo-100 text-indigo-800",
  questionnaire_completed: "bg-indigo-100 text-indigo-800",
  quote_requested: "bg-amber-100 text-amber-800",
  quote_viewed: "bg-amber-100 text-amber-800",
};

function isLive(lastActivity: string) {
  return Date.now() - new Date(lastActivity).getTime() < 2 * 60 * 1000;
}

export default function ClientActivityPanel({ caseId }: { caseId: string }) {
  const [events, setEvents] = useState<CaseActivityEventRow[]>([]);
  const [sessions, setSessions] = useState<CaseSessionRow[]>([]);
  const [responses, setResponses] = useState<OnboardingResponseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [eventsRes, sessionsRes, responsesRes] = await Promise.all([
      supabase
        .from("case_activity_events")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("case_sessions")
        .select("*")
        .eq("case_id", caseId)
        .order("last_activity_at", { ascending: false }),
      supabase
        .from("onboarding_responses")
        .select("*")
        .eq("case_id", caseId)
        .order("submitted_at", { ascending: false }),
    ]);

    setEvents((eventsRes.data as CaseActivityEventRow[]) ?? []);
    setSessions((sessionsRes.data as CaseSessionRow[]) ?? []);
    setResponses((responsesRes.data as OnboardingResponseRow[]) ?? []);
    setLoading(false);
  }, [caseId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  const latestSession = sessions[0];
  const answerEvents = events.filter((e) => e.event_type === "question_answered");

  if (loading) {
    return <p className="text-sm text-gray-500">Loading client activity…</p>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-semibold">Current Status</h3>
        {!latestSession ? (
          <p className="text-sm text-gray-500">This client has never logged in.</p>
        ) : (
          <div className="grid gap-3 rounded-md bg-white p-3 text-sm ring-1 ring-gray-200 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Currently on</p>
              <p className="font-mono">{latestSession.current_page ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Live</p>
              <p>
                {latestSession.ended_at === null && isLive(latestSession.last_activity_at) ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    Online now
                  </span>
                ) : (
                  <span className="text-gray-600">
                    Last seen {new Date(latestSession.last_activity_at).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">IP Address</p>
              <p className="font-mono">{latestSession.last_ip ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Step</p>
              <p>{latestSession.current_step.replace(/_/g, " ")}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-400">Device</p>
              <p className="break-words text-xs text-gray-600">
                {latestSession.last_user_agent ?? "—"}
              </p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Recorded Answers</h3>
        {answerEvents.length === 0 && responses.length === 0 ? (
          <p className="text-sm text-gray-500">No answers recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {answerEvents.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-md bg-white p-3 text-sm ring-1 ring-gray-200"
              >
                <span className="font-medium">
                  {(e.metadata?.question_label as string) ??
                    e.question_key?.replace(/_/g, " ") ??
                    "Question"}
                </span>
                <span className="text-gray-700">{e.answer_value}</span>
                <span className="w-full text-xs text-gray-400">
                  {new Date(e.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Activity Archive</h3>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        ) : (
          <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
            {events.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2 text-sm ring-1 ring-gray-200"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    EVENT_TONE[e.event_type] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {EVENT_LABELS[e.event_type] ?? e.event_type.replace(/_/g, " ")}
                </span>
                {e.answer_value && <span className="text-gray-700">{e.answer_value}</span>}
                {e.page_path && (
                  <span className="font-mono text-xs text-gray-500">{e.page_path}</span>
                )}
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(e.created_at).toLocaleString()}
                  {e.ip_address ? ` · ${e.ip_address}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Submitted Responses</h3>
        {responses.length === 0 ? (
          <p className="text-sm text-gray-500">No submissions yet.</p>
        ) : (
          <div className="space-y-2">
            {responses.map((r) => (
              <div key={r.id} className="rounded-md bg-white p-3 ring-1 ring-gray-200">
                <p className="mb-1 text-xs text-gray-400">
                  Submitted {new Date(r.submitted_at).toLocaleString()}
                </p>
                <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">
                  {JSON.stringify(r.responses, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
