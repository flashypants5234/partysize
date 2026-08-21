"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { QuotePresetRow } from "@/types/staff";

const MAX_PRESETS = 25;

export default function QuotePresetsPanel() {
  const [presets, setPresets] = useState<QuotePresetRow[]>([]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("quote_presets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPresets((data as QuotePresetRow[]) ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (presets.length >= MAX_PRESETS) {
      setError(`You can only save up to ${MAX_PRESETS} presets. Delete one first.`);
      return;
    }
    if (!title.trim() || !quoteText.trim()) {
      setError("Title and quote text are required.");
      return;
    }
    const { error: insertError } = await supabase.from("quote_presets").insert({
      title: title.trim(),
      description: description.trim() || null,
      quote_text: quoteText.trim(),
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle("");
    setDescription("");
    setQuoteText("");
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("quote_presets").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="space-y-3 rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold">New Preset Quote ({presets.length}/{MAX_PRESETS})</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Confidential quote text"
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {error && (
          <p className="text-sm text-red-600" data-no-edit>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save Preset
        </button>
      </form>

      <div className="space-y-2" data-no-edit>
        {presets.map((p) => (
          <div key={p.id} className="rounded-md border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [p.id]: !r[p.id] }))}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {revealed[p.id] ? "Hide" : "Reveal"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 select-none font-mono text-sm">
              {revealed[p.id] ? p.quote_text : "•••••••••••••••••••••"}
            </p>
          </div>
        ))}
        {presets.length === 0 && <p className="text-sm text-gray-500">No presets saved.</p>}
      </div>
    </div>
  );
}