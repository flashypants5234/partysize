'use client';

import { ASSET_TYPES } from '@/data/portal-config';

interface LandingViewProps {
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
  onNavigateToLookup: () => void;
}

export default function LandingView({ selectedAsset, onSelectAsset, onNavigateToLookup }: LandingViewProps) {
  return (
    <main className="pnl-main">
      <section className="pnl-hero">
        <h1 className="pnl-hero-title">Claim Registry Portal</h1>
        <p className="pnl-hero-sub">
          Securely locate and manage your financial assets with our institutional claim system.
        </p>
      </section>

      <section className="pnl-asset-section" aria-label="Select asset type">
        <h2 className="pnl-section-heading">Select an Asset Type</h2>
        <p className="pnl-section-desc">Choose the category that matches your claim to begin.</p>
        <div className="pnl-asset-grid">
          {ASSET_TYPES.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className={`pnl-tile ${selectedAsset === asset.id ? "pnl-tile--selected" : ""}`}
              onClick={() => onSelectAsset(asset.id)}
            >
              <span className={`pnl-tile-icon pnl-tile-icon--${asset.icon}`} aria-hidden="true" />
              <span className="pnl-tile-title">{asset.title}</span>
              <span className="pnl-tile-desc">{asset.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="pnl-hero" style={{ marginTop: '2rem' }}>
        <button
          type="button"
          className="pnl-btn pnl-btn--primary"
          disabled={!selectedAsset}
          onClick={onNavigateToLookup}
        >
          Continue
        </button>
      </section>
    </main>
  );
}