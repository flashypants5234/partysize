CREATE OR REPLACE FUNCTION public.current_staff_role()
RETURNS TEXT
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role FROM public.staff_profiles WHERE auth_user_id = auth.uid() AND active = true LIMIT 1;
$$;