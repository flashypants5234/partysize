CREATE OR REPLACE FUNCTION public.get_case_session(p_token uuid)
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
  responses jsonb,
  quote_text text,
  quote_requested_at timestamptz,
  quote_issued_at timestamptz
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
    ),
    q.quote_text,
    q.requested_at,
    q.issued_at
  FROM public.case_sessions cs
  JOIN public.case_ids ci ON ci.id = cs.case_id
  LEFT JOIN public.case_quotes q ON q.case_id = ci.id
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL AND ci.status = 'active';
END;
$function$;