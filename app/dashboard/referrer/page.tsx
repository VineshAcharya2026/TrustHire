import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/charts/StatCard";
import { FileText, UserCheck, Lock, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function ReferrerDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "REFERRER") redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { reward: true },
  });

  const rewards = referrals.filter((r) => r.reward).map((r) => r.reward!);
  const hired = referrals.filter((r) => r.status === "HIRED").length;
  const active = referrals.filter((r) => !["HIRED", "REJECTED"].includes(r.status)).length;
  const locked = rewards.reduce((s, r) => s + (r.totalAmount - r.releasedAmount), 0);
  const released = rewards.reduce((s, r) => s + r.releasedAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Referrer Dashboard</h1>
        <p className="text-muted">Track referrals and rewards</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total referrals" value={referrals.length} icon={FileText} />
        <StatCard label="Active" value={active} icon={FileText} />
        <StatCard label="Hires" value={hired} icon={UserCheck} />
        <StatCard label="Locked rewards" value={formatCurrency(locked)} icon={Lock} />
      </div>

      <StatCard label="Released rewards" value={formatCurrency(released)} icon={Wallet} className="max-w-sm" />
    </div>
  );
}
