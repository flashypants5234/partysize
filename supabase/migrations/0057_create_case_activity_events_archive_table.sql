CREATE TABLE IF NOT EXISTS public.case_activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.case_ids(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.case_sessions(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  page_path text,
  question_key text,
  answer_value text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);