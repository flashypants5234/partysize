"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { StaffRole } from "@/lib/staff-auth";

export default function StaffNav({
  role,
  displayName,
}: {
  role: StaffRole;
  displayName: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/staff/dashboard", label: "Overview" },
    { href: "/staff/dashboard/sessions", label: "Sessions" },
    ...(role === "admin"
      ? [
          { href: "/staff/dashboard/workers", label: "Workers" },
          { href: "/staff/dashboard/admin-seeds", label: "Admin Seeds" },
        ]
      : []),
  ];

  const initials = (displayName ?? role).slice(0, 2).toUpperCase();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/staff/login");
    router.refresh();
  }

  return (
    <aside className="app-sidebar">
      <div className="user-chip">
        <div className="avatar">{initials}</div>
        <div>
          <div className="name">{displayName ?? role}</div>
          <div className="role">{role === "admin" ? "Admin" : "Worker"}</div>
        </div>
      </div>
      <nav className="app-nav">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : undefined}>
            {link.label}
          </Link>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); handleSignOut(); }}>
          Sign out
        </a>
      </nav>
    </aside>
  );
}
