CREATE OR REPLACE FUNCTION public.log_case_activity(
  p_token uuid,
  p_event_type text,
  p_page_path text DEFAULT NULL,
  p_question_key text DEFAULT NULL,
  p_answer_value text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_ip text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_session_id uuid;
  v_case_id uuid;
  v_ip inet;
BEGIN
  SELECT cs.id, cs.case_id INTO v_session_id, v_case_id
  FROM public.case_sessions cs
  WHERE cs.session_token = p_token AND cs.ended_at IS NULL;

  IF v_session_id IS NULL THEN
    RETURN false;
  END IF;

  BEGIN
    v_ip := p_ip::inet;
  EXCEPTION WHEN others THEN
    v_ip := NULL;
  END;

  INSERT INTO public.case_activity_events (
    case_id, session_id, event_type, page_path, question_key,
    answer_value, metadata, ip_address, user_agent
  ) VALUES (
    v_case_id, v_session_id, p_event_type, p_page_path, p_question_key,
    p_answer_value, COALESCE(p_metadata, '{}'::jsonb), v_ip, p_user_agent
  );

  UPDATE public.case_sessions
  SET last_activity_at = now(),
      current_page = COALESCE(p_page_path, current_page),
      last_ip = COALESCE(v_ip, last_ip),
      last_user_agent = COALESCE(p_user_agent, last_user_agent)
  WHERE id = v_session_id;

  RETURN true;
END;
$function$;