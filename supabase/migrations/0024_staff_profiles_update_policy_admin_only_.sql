CREATE POLICY "staff_profiles_update" ON public.staff_profiles
FOR UPDATE TO authenticated
USING (public.current_staff_role() = 'admin')
WITH CHECK (public.current_staff_role() = 'admin');