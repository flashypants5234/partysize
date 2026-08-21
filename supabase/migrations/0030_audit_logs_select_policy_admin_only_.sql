CREATE POLICY "audit_logs_select" ON public.audit_logs
FOR SELECT TO authenticated
USING (public.current_staff_role() = 'admin');