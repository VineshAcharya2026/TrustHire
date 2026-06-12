"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminNav } from "@/lib/nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={adminNav} title="Admin">
      {children}
    </DashboardShell>
  );
}
