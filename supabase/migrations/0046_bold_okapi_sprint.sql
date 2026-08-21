-- Clean up any previous accounts with these exact identifiers (idempotent)
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin123@local.test', 'worker123@local.test')
);
DELETE FROM public.staff_profiles WHERE auth_user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin123@local.test', 'worker123@local.test')
);
DELETE FROM auth.users WHERE email IN ('admin123@local.test', 'worker123@local.test');
DELETE FROM public.case_ids WHERE code = 'tempcase1';

DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
  worker_user_id uuid := gen_random_uuid();
BEGIN
  -- Temp admin: admin123 / temp
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change, email_change_token_new
  ) VALUES (
    admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin123@local.test', crypt('temp', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), admin_user_id, admin_user_id::text,
    jsonb_build_object('sub', admin_user_id::text, 'email', 'admin123@local.test'),
    'email', now(), now(), now()
  );

  INSERT INTO public.staff_profiles (auth_user_id, role, display_name, active)
  VALUES (admin_user_id, 'admin', 'Temp Admin', true);

  -- Temp worker: worker123 / temp
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change, email_change_token_new
  ) VALUES (
    worker_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'worker123@local.test', crypt('temp', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), worker_user_id, worker_user_id::text,
    jsonb_build_object('sub', worker_user_id::text, 'email', 'worker123@local.test'),
    'email', now(), now(), now()
  );

  INSERT INTO public.staff_profiles (auth_user_id, role, display_name, active)
  VALUES (worker_user_id, 'worker', 'Temp Worker', true);

  -- Temp case ID: tempcase1 (onboarding enabled so you can test the full questionnaire flow)
  INSERT INTO public.case_ids (
    code, status, onboarding_enabled, is_admin_seed, client_status,
    specialist_name, protected_party_name, case_overview
  ) VALUES (
    'tempcase1', 'active', true, false, 'Active',
    'Jordan Alvarez', 'Sample Client', 'This is a temporary demo case for testing the client portal flow.'
  );
END $$;