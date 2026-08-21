CREATE POLICY "case_sessions_select" ON public.case_sessions
FOR SELECT TO authenticated
USING (
  public.current_staff_role() IN ('admin','worker')
  AND EXISTS (
    SELECT 1 FROM public.case_ids c
    WHERE c.id = case_sessions.case_id
    AND (c.is_admin_seed = false OR public.current_staff_role() = 'admin')
  )
);