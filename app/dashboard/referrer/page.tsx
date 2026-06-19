import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { RecentLeadsPanel } from "@/components/referrals/RecentLeadsPanel";
import { FileText, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ReferrerDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "REFERRER") redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { job: { include: { employer: true } } },
    orderBy: { submittedAt: "desc" },
  });

  const hired = referrals.filter((r) => r.status === "HIRED").length;
  const active = referrals.filter((r) => !["HIRED", "REJECTED"].includes(r.status)).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Referrer Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Submit candidates and track referral status</p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/dashboard/referrer/referrals/new">Submit referral</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total referrals" value={referrals.length} icon={FileText} />
        <StatCard label="Active pipeline" value={active} icon={FileText} />
        <StatCard label="Successful hires" value={hired} icon={UserCheck} />
      </div>

      <RecentLeadsPanel
        title="Your recent referrals"
        viewAllHref="/dashboard/referrer/referrals"
        leads={referrals.slice(0, 5).map((r) => ({
          id: r.id,
          candidateName: r.candidateName,
          status: r.status,
          submittedAt: r.submittedAt,
          subtitle: `${r.job.title} · ${r.job.employer.companyName}`,
          href: `/dashboard/referrer/referrals/${r.id}`,
        }))}
      />
    </div>
  );
}
