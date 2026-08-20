'use client';

import type { PageId } from '@/data/portal-config';

interface PortalHeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function PortalHeader({ currentPage, onNavigate }: PortalHeaderProps) {
  const navItems: { id: PageId; label: string }[] = [
    { id: "landing", label: "Home" },
    { id: "lookup", label: "Lookup" },
    { id: "admin", label: "Admin" },
    { id: "staff", label: "Staff" },
  ];

  return (
    <header className="main-header">
      <div className="header-inner">
        <div className="logo-block">
          <span className="logo-icon" aria-hidden="true" />
          <h1 className="inst-name">FIDIC</h1>
        </div>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="nav-btn"
              onClick={() => onNavigate(item.id)}
              aria-current={currentPage === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}