ALTER TABLE public.case_sessions
  ADD COLUMN IF NOT EXISTS current_page text,
  ADD COLUMN IF NOT EXISTS last_ip inet,
  ADD COLUMN IF NOT EXISTS last_user_agent text;