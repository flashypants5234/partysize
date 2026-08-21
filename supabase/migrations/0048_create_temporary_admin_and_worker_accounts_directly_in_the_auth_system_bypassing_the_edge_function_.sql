create extension if not exists pgcrypto;

do $$
declare
  v_admin_id uuid := gen_random_uuid();
  v_worker_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token
  ) values
  ('00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
   'admin123@staff.internal', crypt('temp', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', ''),
  ('00000000-0000-0000-0000-000000000000', v_worker_id, 'authenticated', 'authenticated',
   'worker123@staff.internal', crypt('temp', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '');

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values
  (gen_random_uuid(), v_admin_id, v_admin_id::text, jsonb_build_object('sub', v_admin_id::text, 'email', 'admin123@staff.internal'), 'email', now(), now(), now()),
  (gen_random_uuid(), v_worker_id, v_worker_id::text, jsonb_build_object('sub', v_worker_id::text, 'email', 'worker123@staff.internal'), 'email', now(), now(), now());

  insert into public.staff_profiles (auth_user_id, role, display_name, active, banned)
  values
  (v_admin_id, 'admin', 'Temp Admin', true, false),
  (v_worker_id, 'worker', 'Temp Worker', true, false);
end $$;