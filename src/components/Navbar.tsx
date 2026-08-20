'use client';

import type { PageId } from '@/data/portal-config';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const items: { id: PageId; label: string }[] = [
    { id: "landing", label: "Home" },
    { id: "lookup", label: "Lookup" },
    { id: "admin", label: "Admin" },
    { id: "staff", label: "Staff" },
  ];

  return (
    <header className="pnl-header">
      <div className="pnl-inner">
        <div className="pnl-logo-block">
          <span className="pnl-logo-icon" aria-hidden="true" />
          <h1 className="pnl-inst-name">FIDIC</h1>
        </div>
        <nav className="pnl-nav" aria-label="Primary navigation">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pnl-nav-btn"
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