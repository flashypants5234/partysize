CREATE POLICY "case_activity_events_select" ON public.case_activity_events
AS PERMISSIVE FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.case_ids c
  WHERE c.id = case_activity_events.case_id
    AND (
      public.current_staff_role() = 'admin'
      OR (public.current_staff_role() = 'worker' AND c.is_admin_seed = false AND c.assigned_staff_id = public.current_staff_id())
    )
));