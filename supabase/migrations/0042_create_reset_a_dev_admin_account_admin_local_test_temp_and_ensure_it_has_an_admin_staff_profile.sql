create extension if not exists pgcrypto;

do $$
declare
  v_user_id uuid;
  v_staff_exists boolean;
begin
  select id into v_user_id from auth.users where email = 'admin@local.test';

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, confirmation_token, recovery_token,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', 'admin@local.test',
      crypt('temp', gen_salt('bf')),
      now(), '', '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(), now()
    );
  else
    update auth.users
    set encrypted_password = crypt('temp', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now())
    where id = v_user_id;
  end if;

  select exists(select 1 from public.staff_profiles where auth_user_id = v_user_id) into v_staff_exists;

  if v_staff_exists then
    update public.staff_profiles
    set role = 'admin', active = true
    where auth_user_id = v_user_id;
  else
    insert into public.staff_profiles (auth_user_id, role, display_name, active)
    values (v_user_id, 'admin', 'Admin', true);
  end if;
end $$;