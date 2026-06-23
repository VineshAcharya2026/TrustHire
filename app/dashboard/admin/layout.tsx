"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { superAdminNav } from "@/lib/nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={superAdminNav} title="Super Admin">
      {children}
    </DashboardShell>
  );
}
