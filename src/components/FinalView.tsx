'use client';

interface FinalViewProps {
  onReset: () => void;
}

export default function FinalView({ onReset }: FinalViewProps) {
  return (
    <main className="main-wrap">
      <section className="final-section">
        <div className="success-icon" aria-hidden="true" />
        <h2 className="section-heading">Verification Complete</h2>
        <p className="section-desc">Your asset has been confirmed for authorization</p>

        <div className="download-panel">
          <h3 className="download-heading">Download Documents</h3>
          <div className="download-links">
            <a href="#" className="download-link" onClick={(e) => e.preventDefault()}>
              <span className="download-icon" aria-hidden="true" />
              <span className="download-label">Claim document (PDF)</span>
            </a>
            <a href="#" className="download-link" onClick={(e) => e.preventDefault()}>
              <span className="download-icon" aria-hidden="true" />
              <span className="download-label">Import encoding file</span>
            </a>
          </div>
        </div>

        <div className="import-instructions">
          <h3 className="instructions-heading">Import Instructions</h3>
          <ol className="instructions-list">
            <li className="instruction-item">Incorporate the encoded file to your original format</li>
            <li className="instruction-item">Try to input the format in form and set at permanent</li>
            <li className="instruction-item">Check the data for correct address indication</li>
            <li className="instruction-item">Detect a security entry when inputting services for the asset</li>
          </ol>
        </div>

        <button className="action-btn action-btn--outline" onClick={onReset}>
          Reset & Start Over
        </button>
      </section>
    </main>
  );
}