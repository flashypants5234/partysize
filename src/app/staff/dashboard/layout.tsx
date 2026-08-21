import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff-auth";
import StaffNav from "@/components/StaffNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect("/staff/login");
  }

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
                Internal · Staff Dashboard
              </span>
            </div>
          </nav>
        </div>
      </header>

      <div className="app-shell">
        <StaffNav role={staff.role} displayName={staff.display_name} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
