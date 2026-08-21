export type StaffOption = { id: string; display_name: string | null; role: string };

export type AssigneeInfo = { display_name: string | null };

export type CaseRow = {
  id: string;
  code: string;
  email: string | null;
  onboarding_enabled: boolean;
  status: string;
  is_admin_seed: boolean;
  specialist_name: string | null;
  protected_party_name: string | null;
  case_overview: string | null;
  client_status: string | null;
  notes: string | null;
  created_at: string;
  staff_profiles: AssigneeInfo | AssigneeInfo[] | null;
};

export type AdminSeedRow = {
  id: string;
  code: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export type CaseSessionRow = {
  id: string;
  current_step: string;
  started_at: string;
  last_activity_at: string;
  case_ids: { code: string; email: string | null } | { code: string; email: string | null }[] | null;
};

export type WorkerRow = {
  id: string;
  display_name: string | null;
  role: string;
  active: boolean;
  banned: boolean;
  created_at: string;
};

export type QuoteRequestRow = {
  case_id: string;
  requested_at: string;
  issued_at: string | null;
  case_ids:
    | { code: string; protected_party_name: string | null }
    | { code: string; protected_party_name: string | null }[]
    | null;
};

export type LoginActivityRow = {
  id: string;
  attempted_identifier: string | null;
  ip_address: string | null;
  success: boolean;
  created_at: string;
  staff_profiles: { display_name: string | null } | { display_name: string | null }[] | null;
};

/** Supabase returns joined relations as either an object or an array depending on the query shape. */
export function unwrap<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}