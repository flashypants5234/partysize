'use client';

import { useState } from 'react';
import { MOCK_CASES } from '@/data/portal-config';

interface LookupViewProps {
  onNavigateToAccess: () => void;
  showToast: (message: string) => void;
}

export default function LookupView({ onNavigateToAccess, showToast }: LookupViewProps) {
  const [caseId, setCaseId] = useState("");
  const [result, setResult] = useState<typeof MOCK_CASES[string] | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = caseId.trim().toUpperCase();
    const found = MOCK_CASES[trimmed];
    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("No case found with that ID. Please check and try again.");
      showToast("Case lookup failed");
    }
  };

  return (
    <main className="pnl-main">
      <section className="pnl-lookup-section">
        <h1 className="pnl-section-heading">Case Lookup</h1>
        <p className="pnl-section-desc">Enter your case reference to view its status and proceed.</p>

        <form className="pnl-lookup-form" onSubmit={handleSubmit}>
          <div className="pnl-form-group">
            <label htmlFor="case-id" className="pnl-form-label">Case ID</label>
            <input
              id="case-id"
              type="text"
              className="pnl-form-input"
              placeholder="e.g. CASE-001"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="pnl-btn pnl-btn--primary">Search</button>
        </form>

        {error && (
          <div className="pnl-feedback pnl-feedback--error" role="alert">
            <p className="pnl-feedback-text">{error}</p>
          </div>
        )}

        {result && (
          <div className="pnl-result-panel" aria-live="polite">
            <h2 className="pnl-result-heading">Case Found</h2>
            <div className="pnl-result-list">
              <div className="pnl-result-row">
                <span className="pnl-result-key">Case ID</span>
                <span className="pnl-result-val">{result.id}</span>
              </div>
              <div className="pnl-result-row">
                <span className="pnl-result-key">Type</span>
                <span className="pnl-result-val">{result.type}</span>
              </div>
              <div className="pnl-result-row">
                <span className="pnl-result-key">Status</span>
                <span className="pnl-result-val">{result.status}</span>
              </div>
              <div className="pnl-result-row">
                <span className="pnl-result-key">Date</span>
                <span className="pnl-result-val">{result.date}</span>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                className="pnl-btn pnl-btn--primary"
                onClick={() => { showToast("Proceeding to access verification"); onNavigateToAccess(); }}
              >
                Continue to Access
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}