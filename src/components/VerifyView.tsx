'use client';

import { useState } from 'react';
import { PORTAL_CONFIG } from '@/data/portal-config';

interface VerifyViewProps {
  onNavigateToFinal: () => void;
  showToast: (msg: string) => void;
}

export default function VerifyView({ onNavigateToFinal, showToast }: VerifyViewProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  const storedWord = typeof window !== "undefined" ? sessionStorage.getItem("selectedWord") : null;

  function toggleWord(word: string) {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
    setFeedback(null);
  }

  function handleSubmit() {
    if (selectedWords.length !== 1) {
      showToast("Please select exactly one word");
      return;
    }
    if (selectedWords[0] === storedWord) {
      setFeedback("success");
      setTimeout(() => onNavigateToFinal(), 1000);
    } else {
      setFeedback("error");
      showToast("Verification failed. Please try again.");
    }
  }

  return (
    <main className="main-wrap">
      <section className="verify-section">
        <h2 className="section-heading">Security Verification</h2>
        <p className="section-desc">Select the word from your recovery set to confirm access</p>

        <div className="verify-grid">
          {PORTAL_CONFIG.ACCESS_WORDS.map((word) => (
            <button
              key={word}
              className={`word-badge ${selectedWords.includes(word) ? "selected" : ""}`}
              onClick={() => toggleWord(word)}
              aria-pressed={selectedWords.includes(word)}
            >
              {word}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback-panel ${feedback}`}>
            <p className="feedback-text">
              {feedback === "success"
                ? "Access verified successfully"
                : "Verification failed — incorrect word selected"}
            </p>
          </div>
        )}

        <button
          className="action-btn action-btn--primary"
          onClick={handleSubmit}
          disabled={selectedWords.length !== 1}
          style={{ marginTop: "var(--space-md)" }}
        >
          Confirm & Proceed
        </button>
      </section>
    </main>
  );
}