"use server";

import { cookies } from "next/headers";
import { supabase } from "@/integrations/supabase/client";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";
import { recordActivity } from "@/lib/activity";

/** Logs a single question answer the moment the client selects it. */
export async function recordAnswer(
  category: string,
  questionKey: string,
  questionLabel: string,
  answer: string,
) {
  await recordActivity({
    eventType: "question_answered",
    pagePath: "/questionnaire",
    questionKey,
    answerValue: answer,
    metadata: { category, question_label: questionLabel },
  });
}

/**
 * Saves the questionnaire and reports where to go next. This returns a
 * destination instead of calling redirect() because it is invoked
 * programmatically from a transition, where a thrown NEXT_REDIRECT would
 * surface as a client-side error rather than being handled by the router.
 */
export async function submitQuestionnaire(
  category: string,
  answers: Record<string, string>,
): Promise<{ redirectTo: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token) {
    return { redirectTo: "/access" };
  }

  await supabase.rpc("submit_onboarding", {
    p_token: token,
    p_responses: { category, answers },
  });

  await recordActivity(
    {
      eventType: "questionnaire_completed",
      pagePath: "/questionnaire",
      metadata: { category, answers },
    },
    token,
  );

  return { redirectTo: "/review" };
}
