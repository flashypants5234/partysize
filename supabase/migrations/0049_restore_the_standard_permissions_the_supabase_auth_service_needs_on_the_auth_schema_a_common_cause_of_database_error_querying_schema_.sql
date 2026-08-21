grant usage on schema auth to supabase_auth_admin;
grant all privileges on all tables in schema auth to supabase_auth_admin;
grant all privileges on all sequences in schema auth to supabase_auth_admin;
grant all privileges on all functions in schema auth to supabase_auth_admin;
alter default privileges in schema auth grant all on tables to supabase_auth_admin;
alter default privileges in schema auth grant all on sequences to supabase_auth_admin;
alter default privileges in schema auth grant all on functions to supabase_auth_admin;

grant usage on schema public to supabase_auth_admin;