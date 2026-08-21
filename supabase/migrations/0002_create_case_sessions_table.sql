CREATE TABLE public.case_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.case_ids(id) ON DELETE CASCADE,
  session_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_step TEXT NOT NULL DEFAULT 'logged_in' CHECK (current_step IN ('logged_in','onboarding_in_progress','onboarding_completed','in_portal')),
  ended_at TIMESTAMPTZ
);