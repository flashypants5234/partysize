CREATE OR REPLACE FUNCTION public.current_staff_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT id FROM public.staff_profiles WHERE auth_user_id = auth.uid() AND active = true LIMIT 1;
$$;