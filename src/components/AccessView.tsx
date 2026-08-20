'use client';

import { useState } from 'react';
import { PORTAL_CONFIG } from '@/data/portal-config';

interface AccessViewProps {
  selectedAsset: string | null;
  onNavigateToVerify: () => void;
  showToast: (message: string) => void;
}

export default function AccessView({ selectedAsset, onNavigateToVerify, showToast }: AccessViewProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showWords, setShowWords] = useState(false);

  const toggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleContinue = () => {
    if (selectedWords.length < 3) {
      showToast("Please select at least 3 words");
      return;
    }
    onNavigateToVerify();
  };

  return (
    <main className="pnl-main">
      <section className="pnl-verify-section">
        <h1 className="pnl-section-heading">Access Verification</h1>
        <p className="pnl-section-desc">
          {selectedAsset ? `Selected asset: ${selectedAsset.replace(/-/g, " ")}` : "No asset selected"}
        </p>

        <div className="pnl-access-panel">
          <div className="pnl-access-header">
            <span className="pnl-access-label">Verification Words</span>
            <button
              type="button"
              className="pnl-toggle-btn"
              onClick={() => setShowWords((v) => !v)}
              aria-pressed={showWords}
            >
              {showWords ? "Hide" : "Show"}
            </button>
          </div>

          {showWords && (
            <div className="pnl-access-words" aria-label="Select access words">
              {PORTAL_CONFIG.ACCESS_WORDS.map((word) => (
                <button
                  key={word}
                  type="button"
                  className={`pnl-word-badge ${selectedWords.includes(word) ? "pnl-word-badge--selected" : ""}`}
                  onClick={() => toggleWord(word)}
                  aria-pressed={selectedWords.includes(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          )}

          {!showWords && (
            <p className="pnl-access-hint">
              Click "Show" to display your secret access words. Select at least three to continue.
            </p>
          )}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className="pnl-btn pnl-btn--primary"
            onClick={handleContinue}
            disabled={!showWords || selectedWords.length === 0}
          >
            Continue to Verify
          </button>
        </div>
      </section>
    </main>
  );
}