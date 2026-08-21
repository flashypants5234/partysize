CREATE POLICY "case_ids_select" ON public.case_ids
FOR SELECT TO authenticated
USING (
  public.current_staff_role() IN ('admin','worker')
  AND (is_admin_seed = false OR public.current_staff_role() = 'admin')
);