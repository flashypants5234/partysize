'use client';

import { useState } from 'react';
import { PORTAL_CONFIG, MOCK_CASES, type CaseData } from '@/data/portal-config';

interface AdminViewProps {
  showToast: (msg: string) => void;
}

export default function AdminView({ showToast }: AdminViewProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [cases, setCases] = useState<Record<string, CaseData>>(MOCK_CASES);
  const [newCaseId, setNewCaseId] = useState("");
  const [newCaseType, setNewCaseType] = useState("");
  const [newCaseStatus, setNewCaseStatus] = useState("active");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === PORTAL_CONFIG.ADMIN.username && password === PORTAL_CONFIG.ADMIN.password) {
      setLoggedIn(true);
      setLoginError("");
      showToast("Admin session started");
    } else {
      setLoginError("Invalid credentials");
    }
  }

  function handleCreateCase(e: React.FormEvent) {
    e.preventDefault();
    if (!newCaseId || !newCaseType) {
      showToast("Please fill in all required fields");
      return;
    }
    const newCase: CaseData = {
      id: newCaseId.toUpperCase(),
      type: newCaseType.charAt(0).toUpperCase() + newCaseType.slice(1),
      status: newCaseStatus.charAt(0).toUpperCase() + newCaseStatus.slice(1),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    setCases((prev) => ({ ...prev, [newCase.id]: newCase }));
    setNewCaseId("");
    setNewCaseType("");
    setNewCaseStatus("active");
    showToast(`Case created: ${newCase.id}`);
  }

  if (!loggedIn) {
    return (
      <main className="main-wrap">
        <div className="auth-panel">
          <h2 className="section-heading" style={{ textAlign: "center" }}>Admin Login</h2>
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="admin-user" className="form-label">Username</label>
              <input type="text" id="admin-user" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="admin-pass" className="form-label">Password</label>
              <input type="password" id="admin-pass" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2 className="section-heading">Admin Dashboard</h2>
          <button className="action-btn action-btn--outline" onClick={() => { setLoggedIn(false); setUsername(""); setPassword(""); }}>
            Sign Out
          </button>
        </div>

        <section className="admin-section">
          <h3 className="admin-subheading">Create Case</h3>
          <form className="admin-form" onSubmit={handleCreateCase}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-case-id" className="form-label">Case ID</label>
                <input type="text" id="new-case-id" className="form-input" placeholder="New case ID" value={newCaseId} onChange={(e) => setNewCaseId(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="new-case-type" className="form-label">Type</label>
                <select id="new-case-type" className="form-input" value={newCaseType} onChange={(e) => setNewCaseType(e.target.value)} required>
                  <option value="">Select type</option>
                  <option value="savings">Savings</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="digital">Digital</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="new-case-status" className="form-label">Status</label>
              <select id="new-case-status" className="form-input" value={newCaseStatus} onChange={(e) => setNewCaseStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <button type="submit" className="action-btn action-btn--primary">Create Case</button>
          </form>
        </section>

        <section className="admin-section">
          <h3 className="admin-subheading">Seed Pool</h3>
          <p className="admin-hint">Admin has access to setting seed recovery sets.</p>
          <div className="seed-pool">
            <div className="seed-item">
              <span className="seed-label">Set A</span>
              <code className="seed-code">apple, bridge, candle, dolphin, engine</code>
            </div>
            <div className="seed-item">
              <span className="seed-label">Set B</span>
              <code className="seed-code">forest, guitar, harbor, island, jungle</code>
            </div>
            <div className="seed-item">
              <span className="seed-label">Set C</span>
              <code className="seed-code">king, lantern, meadow, night, ocean</code>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h3 className="admin-subheading">All Cases</h3>
          <div className="case-list">
            {Object.values(cases).map((c) => (
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
      </div>
    </main>
  );
}