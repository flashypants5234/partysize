create table if not exists public.site_text_overrides (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.staff_profiles(id) on delete set null
);

create table if not exists public.site_text_history (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  old_value text,
  new_value text,
  changed_by uuid references public.staff_profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

alter table public.site_text_overrides enable row level security;
alter table public.site_text_history enable row level security;

grant select on table public.site_text_overrides to anon, authenticated;
grant insert, update, delete on table public.site_text_overrides to authenticated;
grant select, insert, update, delete on table public.site_text_overrides to service_role;

grant select, insert on table public.site_text_history to authenticated;
grant select, insert, update, delete on table public.site_text_history to service_role;

drop policy if exists site_text_public_read on public.site_text_overrides;
create policy site_text_public_read on public.site_text_overrides
for select using (true);

drop policy if exists site_text_admin_write on public.site_text_overrides;
create policy site_text_admin_write on public.site_text_overrides
for all to authenticated
using (public.current_staff_role() = 'admin')
with check (public.current_staff_role() = 'admin');

drop policy if exists site_text_history_admin_read on public.site_text_history;
create policy site_text_history_admin_read on public.site_text_history
for select to authenticated using (public.current_staff_role() = 'admin');

drop policy if exists site_text_history_admin_insert on public.site_text_history;
create policy site_text_history_admin_insert on public.site_text_history
for insert to authenticated with check (public.current_staff_role() = 'admin');

alter publication supabase_realtime add table public.site_text_overrides;