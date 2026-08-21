"use client";

import { useState } from "react";
import Link from "next/link";
import { logOutCaseSession } from "@/app/portal/actions";

const stepLabels: Record<string, string> = {
  logged_in: "Logged in",
  onboarding_in_progress: "Onboarding in progress",
  onboarding_completed: "Onboarding completed",
  in_portal: "In portal",
};

export default function PortalShell({
  currentStep,
  onboardingEnabled,
}: {
  currentStep: string;
  onboardingEnabled: boolean;
}) {
  const [view, setView] = useState<"overview" | "policies" | "claims" | "account">("overview");

  const navLinks: Array<{ key: typeof view; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "policies", label: "My Policies" },
    { key: "claims", label: "Claims" },
    { key: "account", label: "Account" },
  ];

  return (
    <div className="as-skin">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand link-plain">
            <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20 2 L36 8 V19 C36 29 29 35 20 38 C11 35 4 29 4 19 V8 Z" fill="#0A1930" stroke="#B9932C" strokeWidth="1.4" />
              <path d="M20 12 L22.8 17.2 L28.5 18 L24.3 21.8 L25.4 27.5 L20 24.6 L14.6 27.5 L15.7 21.8 L11.5 18 L17.2 17.2 Z" fill="#B9932C" />
            </svg>
            <span className="brand-word">
              ASSET SHIELD<span className="placeholder-tag">Company name — placeholder</span>
            </span>
          </Link>
          <nav className="main-nav">
            <div className="nav-actions">
              <span className="small" style={{ color: "var(--slate-light)" }}>
                Case portal
              </span>
              <form action={logOutCaseSession}>
                <button type="submit" className="btn btn-outline btn-sm">
                  Log Out
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      <div className="app-shell">
        <aside className="app-sidebar">
          <div className="user-chip">
            <div className="avatar">CS</div>
            <div>
              <div className="name">Case Session</div>
              <div className="role">Policyholder</div>
            </div>
          </div>
          <nav className="app-nav">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href="#"
                className={view === link.key ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setView(link.key);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="app-main">
          {view === "overview" && (
            <div>
              <div className="app-topbar">
                <div>
                  <h2 style={{ marginBottom: 2 }}>Welcome back.</h2>
                  <p className="small" style={{ margin: 0 }}>
                    Here&apos;s where things stand today.
                  </p>
                </div>
                <Link href="/coverage" className="btn btn-primary btn-sm">
                  Add a Policy
                </Link>
              </div>
              <div className="stat-row">
                <div className="stat-card">
                  <div className="label">Session Status</div>
                  <div className="val" style={{ fontSize: "1.05rem" }}>
                    {stepLabels[currentStep] ?? currentStep}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="label">Onboarding</div>
                  <div className="val" style={{ fontSize: "1.05rem" }}>
                    {onboardingEnabled ? "Enabled" : "Not required"}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="label">Active Policies</div>
                  <div className="val">0</div>
                </div>
                <div className="stat-card">
                  <div className="label">Open Claims</div>
                  <div className="val">0</div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-head">
                  <h3>Your certificates</h3>
                </div>
                <div className="empty-state">
                  No policies on file yet — our team will follow up using your Case ID contact info.
                </div>
              </div>
            </div>
          )}

          {view === "policies" && (
            <div>
              <div className="app-topbar">
                <h2>My Policies</h2>
                <Link href="/coverage" className="btn btn-primary btn-sm">
                  Add a Policy
                </Link>
              </div>
              <div className="panel">
                <div className="empty-state">
                  No policies on file yet — our team will follow up using your Case ID contact info.
                </div>
              </div>
            </div>
          )}

          {view === "claims" && (
            <div>
              <div className="app-topbar">
                <h2>Claims</h2>
                <Link href="/claims" className="btn btn-primary btn-sm">
                  File a New Claim
                </Link>
              </div>
              <div className="panel">
                <div className="empty-state">No claims on file yet.</div>
              </div>
            </div>
          )}

          {view === "account" && (
            <div>
              <div className="app-topbar">
                <h2>Account</h2>
              </div>
              <div className="panel" style={{ maxWidth: 520 }}>
                <div className="empty-state">
                  Your account details are managed by our team using the contact information tied to your Case ID.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
