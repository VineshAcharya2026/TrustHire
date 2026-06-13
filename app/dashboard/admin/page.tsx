import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { RecentLeadsPanel } from "@/components/referrals/RecentLeadsPanel";
import { Users, FileText, Banknote, AlertTriangle, UserCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

async function getStats() {
  const [
    totalUsers,
    totalReferrals,
    totalHires,
    locked,
    released,
    pendingPayouts,
    disputes,
  ] = await Promise.all([
    prisma.user.count({ where: { status: { not: "DELETED" } } }),
    prisma.referral.count(),
    prisma.referral.count({ where: { status: "HIRED" } }),
    prisma.reward.aggregate({ where: { status: "LOCKED" }, _sum: { totalAmount: true } }),
    prisma.reward.aggregate({ _sum: { releasedAmount: true } }),
    prisma.payout.count({ where: { status: "PENDING" } }),
    prisma.reward.count({ where: { status: "DISPUTED" } }),
  ]);

  return {
    totalUsers,
    totalReferrals,
    totalHires,
    locked: locked._sum.totalAmount ?? 0,
    released: released._sum.releasedAmount ?? 0,
    pendingPayouts,
    disputes,
  };
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const stats = await getStats();
  const pending = await prisma.user.count({ where: { status: "PENDING" } });

  const recentReferrals = await prisma.referral.findMany({
    take: 5,
    orderBy: { submittedAt: "desc" },
    include: { job: { include: { employer: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Founder Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Platform-wide KPIs and latest activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/referrals">All leads</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/dashboard/admin/users">Manage users</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Total leads" value={stats.totalReferrals} icon={FileText} />
        <StatCard label="Hires" value={stats.totalHires} icon={UserCheck} trend={`${pending} pending approval`} />
        <StatCard label="Pending payouts" value={stats.pendingPayouts} icon={Banknote} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <RecentLeadsPanel
            title="Recent leads"
            viewAllHref="/dashboard/admin/referrals"
            leads={recentReferrals.map((r) => ({
              id: r.id,
              candidateName: r.candidateName,
              status: r.status,
              submittedAt: r.submittedAt,
              subtitle: `${r.job.title} · ${r.job.employer.companyName}`,
              href: `/dashboard/admin/referrals/${r.id}`,
            }))}
          />
        </div>
        <div className="space-y-4">
          <StatCard label="Locked liability" value={formatCurrency(stats.locked)} icon={Banknote} />
          <StatCard label="Released rewards" value={formatCurrency(stats.released)} icon={Banknote} />
          <StatCard label="Disputes" value={stats.disputes} icon={AlertTriangle} />
        </div>
      </div>
    </div>
  );
}
