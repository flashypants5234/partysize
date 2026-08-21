-- 1. Case exclusivity: track which staff member a case is assigned to
ALTER TABLE public.case_ids ADD COLUMN IF NOT EXISTS assigned_staff_id uuid REFERENCES public.staff_profiles(id);
UPDATE public.case_ids SET assigned_staff_id = created_by WHERE assigned_staff_id IS NULL;

-- 2. Ban flag for staff
ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS banned boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.current_staff_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT role FROM public.staff_profiles WHERE auth_user_id = auth.uid() AND active = true AND banned = false LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.current_staff_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT id FROM public.staff_profiles WHERE auth_user_id = auth.uid() AND active = true AND banned = false LIMIT 1;
$function$;

-- 3. Tighten case_ids policies: workers only see/edit cases assigned to them
DROP POLICY IF EXISTS case_ids_select ON public.case_ids;
CREATE POLICY case_ids_select ON public.case_ids
FOR SELECT TO authenticated
USING (
  current_staff_role() = 'admin'
  OR (current_staff_role() = 'worker' AND is_admin_seed = false AND assigned_staff_id = current_staff_id())
);

DROP POLICY IF EXISTS case_ids_update ON public.case_ids;
CREATE POLICY case_ids_update ON public.case_ids
FOR UPDATE TO authenticated
USING (
  current_staff_role() = 'admin'
  OR (current_staff_role() = 'worker' AND is_admin_seed = false AND assigned_staff_id = current_staff_id())
)
WITH CHECK (
  current_staff_role() = 'admin'
  OR (current_staff_role() = 'worker' AND is_admin_seed = false AND assigned_staff_id = current_staff_id())
);

-- 4. Tighten case_sessions / onboarding_responses to the same exclusivity rule
DROP POLICY IF EXISTS case_sessions_select ON public.case_sessions;
CREATE POLICY case_sessions_select ON public.case_sessions
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.case_ids c
    WHERE c.id = case_sessions.case_id
    AND (
      current_staff_role() = 'admin'
      OR (current_staff_role() = 'worker' AND c.is_admin_seed = false AND c.assigned_staff_id = current_staff_id())
    )
  )
);

DROP POLICY IF EXISTS onboarding_responses_select ON public.onboarding_responses;
CREATE POLICY onboarding_responses_select ON public.onboarding_responses
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.case_ids c
    WHERE c.id = onboarding_responses.case_id
    AND (
      current_staff_role() = 'admin'
      OR (current_staff_role() = 'worker' AND c.is_admin_seed = false AND c.assigned_staff_id = current_staff_id())
    )
  )
);

-- 5. Staff login activity (admin-only visibility; written via service role)
CREATE TABLE IF NOT EXISTS public.staff_login_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid REFERENCES public.staff_profiles(id) ON DELETE SET NULL,
  attempted_identifier text,
  ip_address text,
  user_agent text,
  success boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON TABLE public.staff_login_activity TO service_role;
GRANT SELECT ON TABLE public.staff_login_activity TO authenticated;

ALTER TABLE public.staff_login_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_login_activity_select ON public.staff_login_activity;
CREATE POLICY staff_login_activity_select ON public.staff_login_activity
FOR SELECT TO authenticated USING (current_staff_role() = 'admin');

-- 6. Private worker notes on a case (own notes only, admin sees all)
CREATE TABLE IF NOT EXISTS public.worker_case_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES public.case_ids(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff_profiles(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON TABLE public.worker_case_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.worker_case_notes TO service_role;

ALTER TABLE public.worker_case_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS worker_case_notes_select ON public.worker_case_notes;
CREATE POLICY worker_case_notes_select ON public.worker_case_notes
FOR SELECT TO authenticated
USING (current_staff_role() = 'admin' OR staff_id = current_staff_id());

DROP POLICY IF EXISTS worker_case_notes_insert ON public.worker_case_notes;
CREATE POLICY worker_case_notes_insert ON public.worker_case_notes
FOR INSERT TO authenticated
WITH CHECK (staff_id = current_staff_id());

DROP POLICY IF EXISTS worker_case_notes_delete ON public.worker_case_notes;
CREATE POLICY worker_case_notes_delete ON public.worker_case_notes
FOR DELETE TO authenticated
USING (current_staff_role() = 'admin' OR staff_id = current_staff_id());

-- 7. Confidential quotes (admin + client only)
CREATE TABLE IF NOT EXISTS public.case_quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid NOT NULL UNIQUE REFERENCES public.case_ids(id) ON DELETE CASCADE,
  quote_text text,
  requested_at timestamptz,
  issued_at timestamptz,
  issued_by uuid REFERENCES public.staff_profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.case_quotes TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.case_quotes TO authenticated;

ALTER TABLE public.case_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS case_quotes_admin_all ON public.case_quotes;
CREATE POLICY case_quotes_admin_all ON public.case_quotes
FOR ALL TO authenticated
USING (current_staff_role() = 'admin')
WITH CHECK (current_staff_role() = 'admin');

-- 8. Quote presets (admin-only, secret, no audit trail on delete)
CREATE TABLE IF NOT EXISTS public.quote_presets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  quote_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quote_presets TO service_role;
GRANT SELECT, INSERT, DELETE ON TABLE public.quote_presets TO authenticated;

ALTER TABLE public.quote_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quote_presets_admin_all ON public.quote_presets;
CREATE POLICY quote_presets_admin_all ON public.quote_presets
FOR ALL TO authenticated
USING (current_staff_role() = 'admin')
WITH CHECK (current_staff_role() = 'admin');

-- 9. RPCs for the client-facing quote flow (session-token based, no Supabase auth)
CREATE OR REPLACE FUNCTION public.request_quote(p_token uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_case_id uuid;
BEGIN
  SELECT case_id INTO v_case_id FROM public.case_sessions
  WHERE session_token = p_token AND ended_at IS NULL;

  IF v_case_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.case_quotes (case_id, requested_at)
  VALUES (v_case_id, now())
  ON CONFLICT (case_id) DO UPDATE
    SET requested_at = now()
    WHERE public.case_quotes.issued_at IS NULL;

  RETURN true;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.request_quote(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.request_quote(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_case_quote(p_token uuid)
 RETURNS TABLE(quote_text text, requested_at timestamptz, issued_at timestamptz)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_case_id uuid;
BEGIN
  SELECT case_id INTO v_case_id FROM public.case_sessions
  WHERE session_token = p_token AND ended_at IS NULL;

  IF v_case_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT q.quote_text, q.requested_at, q.issued_at
  FROM public.case_quotes q
  WHERE q.case_id = v_case_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_case_quote(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_case_quote(uuid) TO authenticated;

-- 10. Limited "recent activity" feed for all staff (bypasses per-case exclusivity intentionally)
CREATE OR REPLACE FUNCTION public.list_recent_case_activity()
 RETURNS TABLE(code text, client_status text, onboarding_enabled boolean, created_at timestamptz)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF public.current_staff_role() NOT IN ('admin', 'worker') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT c.code, c.client_status, c.onboarding_enabled, c.created_at
  FROM public.case_ids c
  WHERE c.is_admin_seed = false
  ORDER BY c.created_at DESC
  LIMIT 20;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.list_recent_case_activity() TO authenticated;