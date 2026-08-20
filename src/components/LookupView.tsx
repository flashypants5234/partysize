'use client';

import { useState } from 'react';
import { MOCK_CASES, type CaseData } from '@/data/portal-config';

interface LookupViewProps {
  onNavigateToAccess: () => void;
  showToast: (msg: string) => void;
}

export default function LookupView({ onNavigateToAccess, showToast }: LookupViewProps) {
  const [result, setResult] = useState<CaseData | null>(null);
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputValue.trim().toUpperCase();
    if (!value) {
      showToast("Please enter a reference ID");
      return;
    }
    const caseData = MOCK_CASES[value];
    if (caseData) {
      setResult(caseData);
      sessionStorage.setItem("currentCase", JSON.stringify(caseData));
    } else {
      showToast("No record found for that ID");
      setResult(null);
    }
  }

  return (
    <main className="main-wrap">
      <section className="lookup-section">
        <h2 className="section-heading">Claim Lookup</h2>
        <p className="section-desc">Enter your reference ID to search the registry</p>

        <form className="lookup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="case-id-input" className="form-label">Reference ID</label>
            <input
              type="text"
              id="case-id-input"
              className="form-input"
              placeholder="Enter reference ID (e.g. CASE-001)"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="action-btn action-btn--primary">Search</button>
        </form>

        {result && (
          <div className="result-panel">
            <h3 className="result-heading">Registry Details</h3>
            <dl className="result-list">
              <div className="result-row">
                <dt className="result-key">Claim ID</dt>
                <dd className="result-val">{result.id}</dd>
              </div>
              <div className="result-row">
                <dt className="result-key">Type</dt>
                <dd className="result-val">{result.type}</dd>
              </div>
              <div className="result-row">
                <dt className="result-key">Status</dt>
                <dd className="result-val">{result.status}</dd>
              </div>
              <div className="result-row">
                <dt className="result-key">Date</dt>
                <dd className="result-val">{result.date}</dd>
              </div>
            </dl>
            <button className="action-btn action-btn--secondary" onClick={onNavigateToAccess} style={{ marginTop: "var(--space-md)" }}>
              Proceed to Access
            </button>
          </div>
        )}
      </section>
    </main>
  );
}