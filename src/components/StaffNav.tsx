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
    { href: "/staff/dashboard", label: "Case IDs" },
    { href: "/staff/dashboard/sessions", label: "Sessions" },
    ...(role === "admin"
      ? [
          { href: "/staff/dashboard/workers", label: "Workers" },
          { href: "/staff/dashboard/admin-seeds", label: "Admin Seeds" },
        ]
      : []),
  ];

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/staff/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Staff Portal · {role}
          </p>
          <p className="text-sm font-semibold text-slate-900">{displayName ?? role}</p>
        </div>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 font-medium ${
                pathname === link.href
                  ? "bg-navy-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
