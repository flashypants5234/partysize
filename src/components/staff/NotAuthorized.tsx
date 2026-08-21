"use client";

import { supabase } from "@/integrations/supabase/client";

export default function NotAuthorized() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Not Authorized</h1>
      <p className="mb-6 text-gray-600">
        Your account does not have staff access to this page.
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