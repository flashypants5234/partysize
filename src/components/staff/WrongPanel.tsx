"use client";

import { supabase } from "@/integrations/supabase/client";

export default function WrongPanel({ requiredRole }: { requiredRole: "admin" | "worker" }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Wrong Panel</h1>
      <p className="mb-6 text-gray-600">
        This panel is restricted to {requiredRole} accounts only. Please sign out and use your
        assigned panel.
      </p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
      >
        Sign Out
      </button>
    </div>
  );
}