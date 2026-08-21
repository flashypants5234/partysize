"use client";

import { useState } from "react";

type Preset = { id: string; title: string; quote_text: string };

export default function QuoteComposer({
  caseId,
  initialText,
  presets,
  action,
}: {
  caseId: string;
  initialText: string;
  presets: Preset[];
  action: (formData: FormData) => void;
}) {
  const [text, setText] = useState(initialText);

  return (
    <form action={action}>
      <input type="hidden" name="caseId" value={caseId} />
      {presets.length > 0 && (
        <div className="field">
          <label htmlFor="preset-select">Insert a preset</label>
          <select
            id="preset-select"
            defaultValue=""
            onChange={(e) => {
              const preset = presets.find((p) => p.id === e.target.value);
              if (preset) setText(preset.quote_text);
            }}
          >
            <option value="">— Choose a preset —</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="quoteText">Quote (visible only to admin and this client)</label>
        <textarea
          id="quoteText"
          name="quoteText"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {initialText ? "Update & Re-Issue Quote" : "Issue Quote"}
      </button>
    </form>
  );
}