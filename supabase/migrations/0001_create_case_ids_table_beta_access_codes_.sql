CREATE TABLE public.case_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  onboarding_enabled BOOLEAN NOT NULL DEFAULT false,
  is_admin_seed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked','completed')),
  notes TEXT,
  created_by UUID REFERENCES public.staff_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);