"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { mentorNav } from "@/lib/nav";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={mentorNav} title="Mentor">
      {children}
    </DashboardShell>
  );
}
