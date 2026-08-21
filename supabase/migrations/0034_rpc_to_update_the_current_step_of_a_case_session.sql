CREATE OR REPLACE FUNCTION public.update_case_step(p_token UUID, p_step TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.case_sessions
  SET current_step = p_step, last_activity_at = now()
  WHERE session_token = p_token AND ended_at IS NULL;
  RETURN FOUND;
END;
$$;