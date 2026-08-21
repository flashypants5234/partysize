grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.current_staff_id() to authenticated;
grant execute on function public.list_recent_case_activity() to authenticated;

grant select, insert, update, delete on table public.staff_profiles to authenticated;
grant select, insert, update, delete on table public.case_ids to authenticated;
grant select, insert, update, delete on table public.case_quotes to authenticated;
grant select, insert, update, delete on table public.quote_presets to authenticated;
grant select, insert, update, delete on table public.worker_case_notes to authenticated;
grant select on table public.onboarding_responses to authenticated;
grant select on table public.case_sessions to authenticated;
grant select on table public.staff_login_activity to authenticated;
grant select, insert on table public.audit_logs to authenticated;

grant select, insert, update, delete on table public.staff_profiles to service_role;
grant select, insert, update, delete on table public.case_ids to service_role;
grant select, insert, update, delete on table public.case_quotes to service_role;
grant select, insert, update, delete on table public.quote_presets to service_role;
grant select, insert, update, delete on table public.worker_case_notes to service_role;
grant select, insert, update, delete on table public.onboarding_responses to service_role;
grant select, insert, update, delete on table public.case_sessions to service_role;
grant select, insert, update, delete on table public.staff_login_activity to service_role;
grant select, insert, update, delete on table public.audit_logs to service_role;