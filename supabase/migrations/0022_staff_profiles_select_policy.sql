CREATE POLICY "staff_profiles_select" ON public.staff_profiles
FOR SELECT TO authenticated
USING (auth_user_id = auth.uid() OR public.current_staff_role() = 'admin');