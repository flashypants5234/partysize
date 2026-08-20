'use client';

import { useState } from 'react';

interface VerifyViewProps {
  onNavigateToFinal: () => void;
  showToast: (message: string) => void;
}

export default function VerifyView({ onNavigateToFinal, showToast }: VerifyViewProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleVerify = () => {
    if (!confirmed) {
      showToast("Please confirm your identity to proceed");
      return;
    }
    showToast("Verification successful");
    onNavigateToFinal();
  };

  return (
    <main className="pnl-main">
      <section className="pnl-verify-section">
        <h1 className="pnl-section-heading">Identity Confirmation</h1>
        <p className="pnl-section-desc">
          Review your selected access words and confirm your identity to proceed.
        </p>

        <div className="pnl-access-panel">
          <label className="pnl-form-label" style={{ display: 'block', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            I confirm that the information provided is accurate.
          </label>

          <button
            type="button"
            className="pnl-btn pnl-btn--primary"
            onClick={handleVerify}
          >
            Verify Identity
          </button>
        </div>
      </section>
    </main>
  );
}