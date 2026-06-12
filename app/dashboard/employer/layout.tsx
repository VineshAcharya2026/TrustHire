"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { employerNav } from "@/lib/nav";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={employerNav} title="Employer">
      {children}
    </DashboardShell>
  );
}
