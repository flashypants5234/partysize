'use client';

interface FinalViewProps {
  onReset: () => void;
}

export default function FinalView({ onReset }: FinalViewProps) {
  return (
    <main className="pnl-main">
      <section className="pnl-final-section">
        <div className="pnl-success-icon" aria-hidden="true" />
        <h1 className="pnl-section-heading">Verification Complete</h1>
        <p className="pnl-section-desc">
          Your identity has been confirmed. You may now access your claim documents.
        </p>

        <div className="pnl-download-panel">
          <h2 className="pnl-download-heading">Available Documents</h2>
          <div className="pnl-download-links">
            <a href="#" className="pnl-download-link" onClick={(e) => e.preventDefault()}>
              <span className="pnl-download-icon" aria-hidden="true" />
              <span className="pnl-download-label">Claim Summary (PDF)</span>
            </a>
            <a href="#" className="pnl-download-link" onClick={(e) => e.preventDefault()}>
              <span className="pnl-download-icon" aria-hidden="true" />
              <span className="pnl-download-label">Asset Record (PDF)</span>
            </a>
          </div>
        </div>

        <div className="pnl-import-instructions">
          <h2 className="pnl-instructions-heading">How to Use Your Documents</h2>
          <ol className="pnl-instructions-list">
            <li className="pnl-instruction-item">Download both documents for your records.</li>
            <li className="pnl-instruction-item">Present them at your financial institution for processing.</li>
            <li className="pnl-instruction-item">Keep your case ID and access words confidential.</li>
          </ol>
        </div>

        <button
          type="button"
          className="pnl-btn pnl-btn--secondary"
          onClick={onReset}
          style={{ marginTop: '1rem' }}
        >
          Return to Home
        </button>
      </section>
    </main>
  );
}