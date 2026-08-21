grant execute on function public.validate_case_id(text) to anon, authenticated;
grant execute on function public.get_case_session(uuid) to anon, authenticated;
grant execute on function public.select_case_category(uuid, text) to anon, authenticated;
grant execute on function public.update_case_step(uuid, text) to anon, authenticated;
grant execute on function public.submit_onboarding(uuid, jsonb) to anon, authenticated;
grant execute on function public.request_quote(uuid) to anon, authenticated;
grant execute on function public.get_case_quote(uuid) to anon, authenticated;