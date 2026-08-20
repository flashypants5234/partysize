'use client';

import type { PageId } from '@/data/portal-config';

interface PortalHeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function PortalHeader({ currentPage, onNavigate }: PortalHeaderProps) {
  return (
    <header className="main-header">
      <div className="header-inner">
        <div className="logo-block">
          <span className="logo-icon" aria-hidden="true" />
          <h1 className="inst-name">FIDIC</h1>
        </div>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className="nav-btn" onClick={() => onNavigate("landing")}>Home</button>
          <button className="nav-btn" onClick={() => onNavigate("lookup")}>Profile</button>
          <button className="nav-btn" onClick={() => onNavigate("admin")}>Admin</button>
          <button className="nav-btn" onClick={() => onNavigate("staff")}>Staff</button booktitle>
        </div>
      </header>
  );
}