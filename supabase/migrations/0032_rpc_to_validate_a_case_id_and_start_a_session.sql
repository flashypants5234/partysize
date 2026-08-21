CREATE OR REPLACE FUNCTION public.validate_case_id(p_code TEXT)
RETURNS TABLE(session_token UUID, onboarding_enabled BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_case RECORD;
  v_token UUID;
BEGIN
  SELECT * INTO v_case FROM public.case_ids c WHERE c.code = p_code AND c.status = 'active';

  IF NOT FOUND THEN
    RETURN;
  END IF;

  INSERT INTO public.case_sessions (case_id, current_step)
  VALUES (v_case.id, 'logged_in')
  RETURNING case_sessions.session_token INTO v_token;

  RETURN QUERY SELECT v_token, v_case.onboarding_enabled;
END;
$$;