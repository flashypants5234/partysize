ALTER TABLE public.case_ids
  ADD COLUMN IF NOT EXISTS specialist_name text,
  ADD COLUMN IF NOT EXISTS protected_party_name text,
  ADD COLUMN IF NOT EXISTS case_overview text,
  ADD COLUMN IF NOT EXISTS client_status text NOT NULL DEFAULT 'Active';

ALTER TABLE public.case_sessions
  ADD COLUMN IF NOT EXISTS selected_category text;

DROP FUNCTION IF EXISTS public.get_case_session(uuid);

CREATE FUNCTION public.get_case_session(p_token uuid)
 RETURNS TABLE(
   onboarding_enabled boolean,
   current_step text,
   selected_category text,
   case_code text,
   specialist_name text,
   protected_party_name text,
   case_overview text,
   client_status text,
   case_notes text,
   responses jsonb
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.case_sessions cs SET last_activity_at = now()
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL;

  RETURN QUERY
  SELECT
    ci.onboarding_enabled,
    cs.current_step,
    cs.selected_category,
    ci.code,
    ci.specialist_name,
    ci.protected_party_name,
    ci.case_overview,
    ci.client_status,
    ci.notes,
    (
      SELECT r.responses FROM public.onboarding_responses r
      WHERE r.case_id = ci.id
      ORDER BY r.submitted_at DESC
      LIMIT 1
    )
  FROM public.case_sessions cs
  JOIN public.case_ids ci ON ci.id = cs.case_id
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL AND ci.status = 'active';
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_case_session(uuid) TO anon;

CREATE OR REPLACE FUNCTION public.select_case_category(p_token uuid, p_category text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.case_sessions
  SET selected_category = p_category, current_step = 'category_selected', last_activity_at = now()
  WHERE session_token = p_token AND ended_at IS NULL;
  RETURN FOUND;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.select_case_category(uuid, text) TO anon;