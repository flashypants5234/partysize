"use client";

import { useEffect, useState } from "react";
import { siteText } from "@/lib/siteText";
import { useSiteTextStore } from "@/hooks/useSiteText";
import { useStaffSession } from "@/hooks/useStaffSession";

export default function TextEditorMount() {
  useSiteTextStore();
  const { role, staffId } = useStaffSession();
  const [showManager, setShowManager] = useState(false);
  const [search, setSearch] = useState("");
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        siteText.toggleEditMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin]);

  if (!isAdmin || !siteText.isEditMode()) return null;

  const keys = siteText.getAllKeys().filter((k) => k.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-amber-400 bg-gray-900 p-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-amber-300">Text Edit Mode</span>
        <span className="text-xs text-gray-400">Double-click highlighted text to edit</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => siteText.undo(staffId)}
            disabled={!siteText.canUndo()}
            className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600 disabled:opacity-40"
          >
            Undo
          </button>
          <button
            onClick={() => siteText.redo(staffId)}
            disabled={!siteText.canRedo()}
            className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600 disabled:opacity-40"
          >
            Redo
          </button>
          <button
            onClick={() => setShowManager((s) => !s)}
            className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
          >
            {showManager ? "Hide" : "Manage"} Overrides
          </button>
          <button
            onClick={() => siteText.setEditMode(false)}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-900 hover:bg-white"
          >
            Exit
          </button>
        </div>
      </div>

      {showManager && (
        <div className="mx-auto mt-3 max-h-64 max-w-6xl overflow-y-auto rounded bg-gray-800 p-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search text keys…"
            className="mb-2 w-full rounded bg-gray-700 px-2 py-1 text-sm text-white placeholder-gray-400"
          />
          <table className="w-full text-left text-xs">
            <thead className="text-gray-400">
              <tr>
                <th className="py-1">Key</th>
                <th className="py-1">Current</th>
                <th className="py-1">Overridden</th>
                <th className="py-1"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k} className="border-t border-gray-700">
                  <td className="py-1 font-mono">{k}</td>
                  <td className="py-1">{siteText.get(k, siteText.getDefault(k))}</td>
                  <td className="py-1">{siteText.hasOverride(k) ? "Yes" : "No"}</td>
                  <td className="space-x-2 py-1">
                    <button
                      onClick={() => navigator.clipboard.writeText(k)}
                      className="text-blue-300 hover:underline"
                    >
                      Copy Key
                    </button>
                    {siteText.hasOverride(k) && (
                      <button
                        onClick={() => siteText.reset(k, staffId)}
                        className="text-amber-300 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-gray-400">
                    No text keys registered on this page yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}