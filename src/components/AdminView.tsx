'use client';

import { useState } from 'react';
import { PORTAL_CONFIG, MOCK_CASES } from '@/data/portal-config';

interface AdminViewProps {
  showToast: (message: string) => void;
}

export default function AdminView({ showToast }: AdminViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === PORTAL_CONFIG.ADMIN.username && password === PORTAL_CONFIG.ADMIN.password) {
      setIsAuthenticated(true);
      setError("");
      showToast("Admin login successful");
    } else {
      setError("Invalid admin credentials");
      showToast("Admin login failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pnl-main">
        <div className="pnl-auth-panel">
          <h1 className="pnl-section-heading">Admin Login</h1>
          <form className="pnl-auth-form" onSubmit={handleLogin}>
            <div className="pnl-form-group">
              <label htmlFor="admin-user" className="pnl-form-label">Username</label>
              <input
                id="admin-user"
                type="text"
                className="pnl-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="pnl-form-group">
              <label htmlFor="admin-pass" className="pnl-form-label">Password</label>
              <input
                id="admin-pass"
                type="password"
                className="pnl-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="pnl-auth-error">{error}</p>}
            <button type="submit" className="pnl-btn pnl-btn--primary">Sign In</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="pnl-main">
      <div className="pnl-admin-dashboard">
        <div className="pnl-admin-header">
          <h1 className="pnl-section-heading">Admin Dashboard</h1>
          <button
            type="button"
            className="pnl-btn pnl-btn--outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>

        <section className="pnl-admin-section">
          <h2 className="pnl-admin-subheading">Seed Pool</h2>
          <p className="pnl-admin-hint">Temporary access codes for testing.</p>
          <div className="pnl-seed-pool">
            {PORTAL_CONFIG.ACCESS_WORDS.map((word, i) => (
              <div key={word} className="pnl-seed-item">
                <span className="pnl-seed-label">Word {i + 1}</span>
                <code className="pnl-seed-code">{word}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="pnl-admin-section">
          <h2 className="pnl-admin-subheading">Registered Cases</h2>
          <div className="pnl-case-list">
            {Object.values(MOCK_CASES).map((caseItem) => (
              <div key={caseItem.id} className="pnl-case-item">
                <div>
                  <div className="pnl-case-item-id">{caseItem.id}</div>
                  <div className="pnl-case-item-meta">{caseItem.type} · {caseItem.date}</div>
                </div>
                <span className={`pnl-case-status pnl-case-status--${caseItem.status.toLowerCase()}`}>
                  {caseItem.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}