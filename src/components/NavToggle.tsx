"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/coverage", label: "Coverage" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/claims", label: "Claims" },
  { href: "/about", label: "About" },
];

export default function NavToggle({
  active,
  showAuthActions = true,
}: {
  active?: string;
  showAuthActions?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`main-nav-links${open ? " open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={active === link.href ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="nav-actions">
        {showAuthActions && (
          <>
            <Link href="/access" className="btn btn-outline btn-sm">
              Log In
            </Link>
            <Link href="/coverage" className="btn btn-primary btn-sm">
              Get Covered
            </Link>
          </>
        )}
        <button
          type="button"
          className="nav-toggle btn btn-outline btn-sm"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
    </>
  );
}
