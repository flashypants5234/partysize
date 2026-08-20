'use client';

import { useState } from 'react';
import { PORTAL_CONFIG, MOCK_CASES, type CaseData } from '@/data/portal-config';

interface StaffViewProps {
  showToast: (msg: string) => void;
}

export default function StaffView({ showToast }: StaffViewProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === PORTAL_CONFIG.STAFF.username && password === PORTAL_CONFIG.STAFF.password) {
      setLoggedIn(true);
      setLoginError("");
      showToast("Staff session started");
    } else {
      setLoginError("Invalid credentials");
    }
  }

  if (!loggedIn) {
    return (
      <main className="main-wrap">
        <div className="auth-panel">
          <h2 className="section-heading" style={{ textAlign: "center" }}>Staff Login</h2>
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="staff-user" className="form-label">Username</label>
              <input type="text" id="staff-user" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="staff-pass" className="form-label">Password</label>
              <input type="password" id="staff-pass" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="action-btn action-btn--primary">Sign In</button>
          </form>
          {loginError && <p className="auth-error">{loginError}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="main-wrap">
      <div className="staff-dashboard">
        <div className="staff-header">
          <h2 className="section-heading">Staff Dashboard</h2>
          <button className="action-btn action-btn--outline" onClick={() => { setLoggedIn(false); setUsername(""); setPassword(""); }}>
            Sign Out
          </button>
        </div>

        <section className="staff-section">
          <h3 className="staff-subheading">Case Registry</h3>
          <div className="case-list">
            {Object.values(MOCK_CASES).map((c: CaseData) => (
              <div key={c.id} className="case-item">
                <div>
                  <span className="case-item-id">{c.id}</span>
                  <span className="case-item-meta"> · {c.type} · {c.date}</span>
                </div>
                <span className={`case-status case-status--${c.status.toLowerCase()}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="staff-section">
          <h3 className="staff-subheading">Claims</h3>
          <div className="claim-panel">
            <p className="claim-text">Claims are a fund for the registry indication.</p>
            <button className="action-btn action-btn--secondary" onClick={() => showToast("Claim registry accessed")}>
              Claim Registry
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}