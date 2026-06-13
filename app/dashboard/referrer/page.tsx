import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { RecentLeadsPanel } from "@/components/referrals/RecentLeadsPanel";
import { FileText, UserCheck, Lock, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function ReferrerDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "REFERRER") redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { reward: true, job: { include: { employer: true } } },
    orderBy: { submittedAt: "desc" },
  });

  const rewards = referrals.filter((r) => r.reward).map((r) => r.reward!);
  const hired = referrals.filter((r) => r.status === "HIRED").length;
  const active = referrals.filter((r) => !["HIRED", "REJECTED"].includes(r.status)).length;
  const locked = rewards.reduce((s, r) => s + (r.totalAmount - r.releasedAmount), 0);
  const released = rewards.reduce((s, r) => s + r.releasedAmount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Referrer Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Track your leads and reward earnings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/referrer/rewards">Rewards</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/dashboard/referrer/referrals/new">Submit lead</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={referrals.length} icon={FileText} />
        <StatCard label="Active pipeline" value={active} icon={FileText} />
        <StatCard label="Successful hires" value={hired} icon={UserCheck} />
        <StatCard label="Locked rewards" value={formatCurrency(locked)} icon={Lock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLeadsPanel
            title="Your recent leads"
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
        <StatCard label="Released rewards" value={formatCurrency(released)} icon={Wallet} />
      </div>
    </div>
  );
}
