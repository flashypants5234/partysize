"use client";

import { useEffect, useState } from "react";
import { siteText, type SiteTextEntry, type SiteTextHistoryEntry } from "@/lib/siteText";
import { useSiteTextStore } from "@/hooks/useSiteText";

export default function SiteTextPanel({ staffId }: { staffId: string }) {
  useSiteTextStore();
  const [search, setSearch] = useState("");
  const [historyKey, setHistoryKey] = useState<string | null>(null);
  const [history, setHistory] = useState<SiteTextHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const entries: SiteTextEntry[] = siteText
    .getEntries()
    .filter(
      (e) =>
        !search.trim() ||
        e.key.toLowerCase().includes(search.toLowerCase()) ||
        e.value.toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    if (!historyKey) {
      setHistory([]);
      return;
    }
    setLoadingHistory(true);
    siteText.fetchHistory(historyKey).then((rows) => {
      setHistory(rows);
      setLoadingHistory(false);
    });
  }, [historyKey]);

  const handleRevert = async (key: string) => {
    await siteText.reset(key, staffId);
    if (historyKey === key) {
      const rows = await siteText.fetchHistory(key);
      setHistory(rows);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Site Text Overrides</h2>
        <p className="mt-1 text-sm text-gray-500">
          Press <kbd className="rounded border border-gray-300 bg-gray-100 px-1">Ctrl/Cmd + Alt + E</kbd> on any
          page to enter live edit mode. Every override made there shows up here.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by key or text…"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2">Current Value</th>
              <th className="px-4 py-2">Updated By</th>
              <th className="px-4 py-2">Updated</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((e) => (
              <tr key={e.key}>
                <td className="px-4 py-2 font-mono text-xs">{e.key}</td>
                <td className="max-w-xs truncate px-4 py-2">{e.value}</td>
                <td className="px-4 py-2">{e.updatedByName ?? "—"}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {e.updatedAt ? new Date(e.updatedAt).toLocaleString() : "—"}
                </td>
                <td className="space-x-3 px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => setHistoryKey(historyKey === e.key ? null : e.key)}
                    className="text-blue-600 hover:underline"
                  >
                    {historyKey === e.key ? "Hide History" : "History"}
                  </button>
                  <button onClick={() => handleRevert(e.key)} className="text-red-600 hover:underline">
                    Revert
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No overrides yet. Use the hotkey on any page to start editing text live.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {historyKey && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 font-semibold">
            History for <span className="font-mono text-sm">{historyKey}</span>
          </h3>
          {loadingHistory && <p className="text-sm text-gray-500">Loading…</p>}
          {!loadingHistory && history.length === 0 && (
            <p className="text-sm text-gray-500">No history recorded for this key.</p>
          )}
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id} className="rounded-md border border-gray-100 bg-gray-50 p-2 text-sm">
                <div className="text-xs text-gray-400">
                  {new Date(h.changedAt).toLocaleString()} · {h.changedByName ?? "Unknown"}
                </div>
                <div className="mt-1">
                  <span className="text-gray-400 line-through">{h.oldValue ?? "(empty)"}</span>
                  {" → "}
                  <span className="font-medium">{h.newValue ?? "(reverted)"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}