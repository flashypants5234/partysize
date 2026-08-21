CREATE POLICY "case_ids_insert" ON public.case_ids
FOR INSERT TO authenticated
WITH CHECK (
  public.current_staff_role() IN ('admin','worker')
  AND (is_admin_seed = false OR public.current_staff_role() = 'admin')
);