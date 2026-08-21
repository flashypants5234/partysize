"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { WorkerRow } from "@/types/staff";

export default function WorkersPanel() {
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"worker" | "admin">("worker");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    supabase
      .from("staff_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setWorkers((data as WorkerRow[]) ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const { error: fnError } = await supabase.functions.invoke("create-staff-user", {
      body: { email, password, role, display_name: displayName || null },
      headers: { Authorization: `Bearer ${sessionData.session?.access_token}` },
    });
    setLoading(false);
    if (fnError) {
      setError(fnError.message);
      return;
    }
    setSuccess(`Login created for ${email}.`);
    setEmail("");
    setPassword("");
    setDisplayName("");
    load();
  };

  const toggleActive = async (w: WorkerRow) => {
    await supabase.from("staff_profiles").update({ active: !w.active }).eq("id", w.id);
    load();
  };

  const toggleBanned = async (w: WorkerRow) => {
    await supabase.from("staff_profiles").update({ banned: !w.banned }).eq("id", w.id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
        <h3 className="font-semibold sm:col-span-2">Issue New Staff Login</h3>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Temporary password"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name (optional)"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "worker" | "admin")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        {success && <p className="text-sm text-green-600 sm:col-span-2">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Creating…" : "Create Login"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Banned</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workers.map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-2">{w.display_name ?? "—"}</td>
                <td className="px-4 py-2">{w.role}</td>
                <td className="px-4 py-2">{w.active ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{w.banned ? "Yes" : "No"}</td>
                <td className="px-4 py-2 space-x-3">
                  <button onClick={() => toggleActive(w)} className="text-blue-600 hover:underline">
                    {w.active ? "Deactivate" : "Reactivate"}
                  </button>
                  <button onClick={() => toggleBanned(w)} className="text-red-600 hover:underline">
                    {w.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}