export interface CaseRow {
  id: string;
  code: string;
  email: string | null;
  phone: string | null;
  onboarding_enabled: boolean;
  is_admin_seed: boolean;
  status: string;
  notes: string | null;
  created_at: string;
  specialist_name: string | null;
  protected_party_name: string | null;
  case_overview: string | null;
  client_status: string;
  assigned_staff_id: string | null;
}

export interface WorkerRow {
  id: string;
  auth_user_id: string;
  role: "admin" | "worker";
  display_name: string | null;
  active: boolean;
  banned: boolean;
  created_at: string;
}

export interface QuoteRow {
  id: string;
  case_id: string;
  quote_text: string | null;
  requested_at: string | null;
  issued_at: string | null;
}

export interface QuotePresetRow {
  id: string;
  title: string;
  description: string | null;
  quote_text: string;
  created_at: string;
}

export interface LoginActivityRow {
  id: string;
  staff_id: string | null;
  attempted_identifier: string | null;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  created_at: string;
}

export interface NoteRow {
  id: string;
  case_id: string;
  staff_id: string;
  note: string;
  created_at: string;
}

export interface OnboardingResponseRow {
  id: string;
  case_id: string;
  responses: Record<string, unknown>;
  submitted_at: string;
}

export interface CaseActivityEventRow {
  id: string;
  case_id: string;
  session_id: string | null;
  event_type: string;
  page_path: string | null;
  question_key: string | null;
  answer_value: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CaseSessionRow {
  id: string;
  case_id: string;
  started_at: string;
  last_activity_at: string;
  current_step: string;
  selected_category: string | null;
  ended_at: string | null;
  current_page: string | null;
  last_ip: string | null;
  last_user_agent: string | null;
}

// Supabase embeds a foreign-key relation as either an object or a single-item
// array depending on how the relationship is inferred. This normalizes both.
export function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}