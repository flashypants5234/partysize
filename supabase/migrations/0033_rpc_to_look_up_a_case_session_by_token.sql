CREATE OR REPLACE FUNCTION public.get_case_session(p_token UUID)
RETURNS TABLE(onboarding_enabled BOOLEAN, current_step TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.case_sessions cs SET last_activity_at = now()
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL;

  RETURN QUERY
  SELECT ci.onboarding_enabled, cs.current_step
  FROM public.case_sessions cs
  JOIN public.case_ids ci ON ci.id = cs.case_id
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL AND ci.status = 'active';
END;
$$;