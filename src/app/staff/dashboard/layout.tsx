import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff-auth";
import StaffNav from "@/components/StaffNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect("/staff/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StaffNav role={staff.role} displayName={staff.display_name} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
