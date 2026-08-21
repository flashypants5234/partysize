CREATE OR REPLACE FUNCTION public.submit_onboarding(p_token UUID, p_responses JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_case_id UUID;
BEGIN
  SELECT case_id INTO v_case_id FROM public.case_sessions
  WHERE session_token = p_token AND ended_at IS NULL;

  IF v_case_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.onboarding_responses (case_id, responses) VALUES (v_case_id, p_responses);

  UPDATE public.case_sessions
  SET current_step = 'onboarding_completed', last_activity_at = now()
  WHERE session_token = p_token;

  RETURN true;
END;
$$;