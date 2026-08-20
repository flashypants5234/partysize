'use client';

import { ASSET_TYPES } from '@/data/portal-config';

interface LandingViewProps {
  selectedAsset: string | null;
  onSelectAsset: (assetId: string) => void;
  onNavigateToLookup: () => void;
}

export default function LandingView({ selectedAsset, onSelectAsset, onNavigateToLookup }: LandingViewProps) {
  return (
    <main className="main-wrap">
      <section className="hero-section">
        <h2 className="hero-title">Insurance Service</h2>
        <p className="hero-subtitle">Claim registry and asset management</p>
      </section>

      <section className="asset-selection">
        <h3 className="section-label">Select asset type</h3>
        <div className="asset-grid">
          {ASSET_TYPES.map((asset) => (
            <div
              key={asset.id}
              className={`asset-tile ${selectedAsset === asset.id ? "selected" : ""}`}
              onClick={() => onSelectAsset(asset.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectAsset(asset.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={selectedAsset === asset.id}
            >
              <div className={`tile-icon tile-icon--${asset.icon}`} />
              <h4 className="tile-title">{asset.title}</h4>
              <p className="tile-desc">{asset.desc}</p>
            </div>
          ))}
        </div>
        {selectedAsset && (
          <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
            <button className="action-btn action-btn--primary" onClick={onNavigateToLookup}>
              Continue to Lookup
            </button>
          </div>
        )}
      </section>
    </main>
  );
}