"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type StaffRole = "admin" | "worker" | null;

export function useStaffSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRole>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRole = async (currentSession: Session | null) => {
      if (!currentSession) {
        if (active) {
          setRole(null);
          setStaffId(null);
          setLoading(false);
        }
        return;
      }
      const [{ data: roleData }, { data: idData }] = await Promise.all([
        supabase.rpc("current_staff_role"),
        supabase.rpc("current_staff_id"),
      ]);
      if (!active) return;
      setRole((roleData as StaffRole) ?? null);
      setStaffId((idData as string) ?? null);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadRole(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(true);
      loadRole(newSession);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, role, staffId, loading };
}