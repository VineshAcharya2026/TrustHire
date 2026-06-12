"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { referrerNav } from "@/lib/nav";

export default function ReferrerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={referrerNav} title="Referrer">
      {children}
    </DashboardShell>
  );
}
