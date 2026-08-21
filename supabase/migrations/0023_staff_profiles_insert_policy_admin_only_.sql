CREATE POLICY "staff_profiles_insert" ON public.staff_profiles
FOR INSERT TO authenticated
WITH CHECK (public.current_staff_role() = 'admin');