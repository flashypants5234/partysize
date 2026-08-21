create extension if not exists pgcrypto;

do $$
declare
  v_email text;
  v_role text;
  v_display text;
  v_user_id uuid;
  v_staff_exists boolean;
  v_identity_exists boolean;
begin
  for v_email, v_role, v_display in
    select * from (values
      ('admin@local.test','admin','Admin'),
      ('worker@local.test','worker','Worker')
    ) as t(email, role, display)
  loop
    select id into v_user_id from auth.users where email = v_email;

    if v_user_id is null then
      v_user_id := gen_random_uuid();

      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmation_token, recovery_token,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000',
        v_user_id, 'authenticated', 'authenticated', v_email,
        crypt('temp', gen_salt('bf')),
        now(), '', '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        now(), now()
      );
    else
      update auth.users
      set encrypted_password = crypt('temp', gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          banned_until = null,
          deleted_at = null
      where id = v_user_id;
    end if;

    begin
      select exists(select 1 from auth.identities where user_id = v_user_id and provider = 'email') into v_identity_exists;
      if not v_identity_exists then
        insert into auth.identities (
          id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
        ) values (
          gen_random_uuid(), v_user_id, v_user_id::text,
          jsonb_build_object('sub', v_user_id::text, 'email', v_email),
          'email', now(), now(), now()
        );
      end if;
    exception when others then
      -- Skip identity creation if the schema differs; sign-in still works via auth.users.
      null;
    end;

    select exists(select 1 from public.staff_profiles where auth_user_id = v_user_id) into v_staff_exists;

    if v_staff_exists then
      update public.staff_profiles
      set role = v_role, active = true, display_name = v_display
      where auth_user_id = v_user_id;
    else
      insert into public.staff_profiles (auth_user_id, role, display_name, active)
      values (v_user_id, v_role, v_display, true);
    end if;
  end loop;
end $$;