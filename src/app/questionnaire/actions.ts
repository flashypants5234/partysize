"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export async function submitQuestionnaire(category: string, answers: Record<string, string>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CASE_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/access");
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

  redirect("/review");
}
