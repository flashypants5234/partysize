'use client';

import { useState } from 'react';
import { PORTAL_CONFIG, MOCK_CASES } from '@/data/portal-config';

interface StaffViewProps {
  showToast: (message: string) => void;
}

export default function StaffView({ showToast }: StaffViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === PORTAL_CONFIG.STAFF.username && password === PORTAL_CONFIG.STAFF.password) {
      setIsAuthenticated(true);
      setError("");
      showToast("Staff login successful");
    } else {
      setError("Invalid staff credentials");
      showToast("Staff login failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pnl-main">
        <div className="pnl-auth-panel">
          <h1 className="pnl-section-heading">Staff Login</h1>
          <form className="pnl-auth-form" onSubmit={handleLogin}>
            <div className="pnl-form-group">
              <label htmlFor="staff-user" className="pnl-form-label">Username</label>
              <input
                id="staff-user"
                type="text"
                className="pnl-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="pnl-form-group">
              <label htmlFor="staff-pass" className="pnl-form-label">Password</label>
              <input
                id="staff-pass"
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
      <div className="pnl-staff-dashboard">
        <div className="pnl-staff-header">
          <h1 className="pnl-section-heading">Staff Dashboard</h1>
          <button
            type="button"
            className="pnl-btn pnl-btn--outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>

        <section className="pnl-staff-section">
          <h2 className="pnl-staff-subheading">Case Queue</h2>
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