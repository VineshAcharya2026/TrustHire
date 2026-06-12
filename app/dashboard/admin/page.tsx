import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { Users, FileText, Banknote, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Founder Dashboard</h1>
        <p className="text-muted">Platform-wide KPIs and activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Referrals" value={stats.totalReferrals} icon={FileText} />
        <StatCard label="Hires" value={stats.totalHires} icon={Users} trend={`${pending} pending approval`} />
        <StatCard label="Pending payouts" value={stats.pendingPayouts} icon={Banknote} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Locked liability" value={formatCurrency(stats.locked)} icon={Banknote} />
        <StatCard label="Released rewards" value={formatCurrency(stats.released)} icon={Banknote} />
        <StatCard label="Disputes" value={stats.disputes} icon={AlertTriangle} />
      </div>
    </div>
  );
}
