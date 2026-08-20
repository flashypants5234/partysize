'use client';

import { useState } from 'react';
import { PORTAL_CONFIG } from '@/data/portal-config';

interface AccessViewProps {
  onNavigateToVerify: () => void;
  showToast: (msg: string) => void;
}

export default function AccessView({ onNavigateToVerify, showToast }: AccessViewProps) {
  const [visible, setVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  function handleVerify() {
    if (!selectedWord) {
      showToast("Please select a word from the recovery set");
      return;
    }
    sessionStorage.setItem("selectedWord", selectedWord);
    onNavigateToVerify();
  }

  return (
    <main className="main-wrap">
      <section className="verify-section">
        <h2 className="section-heading">Access Data</h2>
        <p className="section-desc">Review and verify your recovery set</p>

        <div className="access-panel">
          <div className="access-header">
            <span className="access-label">Recovery Set</span>
            <button
              className="toggle-btn"
              onClick={() => setVisible(!visible)}
              aria-expanded={visible}
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>

          {visible && (
            <div className="access-words">
              {PORTAL_CONFIG.ACCESS_WORDS.map((word) => (
                <button
                  key={word}
                  className={`word-badge ${selectedWord === word ? "selected" : ""}`}
                  onClick={() => setSelectedWord(selectedWord === word ? null : word)}
                  aria-pressed={selectedWord === word}
                >
                  {word}
                </button>
              ))}
            </div>
          )}

          <p className="access-hint">
            The recovery set is confidential. Select the word you were assigned to verify your identity.
          </p>
        </div>

        <button
          className="action-btn action-btn--primary"
          onClick={handleVerify}
          style={{ marginTop: "var(--space-lg)" }}
        >
          Verify Access
        </button>
      </section>
    </main>
  );
}