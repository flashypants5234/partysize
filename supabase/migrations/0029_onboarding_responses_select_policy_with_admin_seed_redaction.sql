CREATE POLICY "onboarding_responses_select" ON public.onboarding_responses
FOR SELECT TO authenticated
USING (
  public.current_staff_role() IN ('admin','worker')
  AND EXISTS (
    SELECT 1 FROM public.case_ids c
    WHERE c.id = onboarding_responses.case_id
    AND (c.is_admin_seed = false OR public.current_staff_role() = 'admin')
  )
);