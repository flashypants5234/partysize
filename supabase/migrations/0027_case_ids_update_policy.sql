CREATE POLICY "case_ids_update" ON public.case_ids
FOR UPDATE TO authenticated
USING (
  public.current_staff_role() IN ('admin','worker')
  AND (is_admin_seed = false OR public.current_staff_role() = 'admin')
)
WITH CHECK (
  public.current_staff_role() IN ('admin','worker')
  AND (is_admin_seed = false OR public.current_staff_role() = 'admin')
);