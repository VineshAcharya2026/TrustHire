"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { menteeNav } from "@/lib/nav";

export default function MenteeLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={menteeNav} title="Mentee">
      {children}
    </DashboardShell>
  );
}
