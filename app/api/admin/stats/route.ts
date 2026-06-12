import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const [
    totalUsers,
    activeEmployers,
    activeReferrers,
    totalReferrals,
    totalHires,
    lockedRewards,
    releasedRewards,
    pendingPayouts,
    disputes,
  ] = await Promise.all([
    prisma.user.count({ where: { status: { not: "DELETED" } } }),
    prisma.user.count({ where: { role: "EMPLOYER", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "REFERRER", status: "ACTIVE" } }),
    prisma.referral.count(),
    prisma.referral.count({ where: { status: "HIRED" } }),
    prisma.reward.aggregate({ where: { status: "LOCKED" }, _sum: { totalAmount: true } }),
    prisma.reward.aggregate({ where: { status: "RELEASED" }, _sum: { releasedAmount: true } }),
    prisma.payout.count({ where: { status: "PENDING" } }),
    prisma.reward.count({ where: { status: "DISPUTED" } }),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentReferrals = await prisma.referral.groupBy({
    by: ["submittedAt"],
    where: { submittedAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  return NextResponse.json({
    totalUsers,
    activeEmployers,
    activeReferrers,
    totalReferrals,
    totalHires,
    rewardLiability: {
      locked: lockedRewards._sum.totalAmount ?? 0,
      released: releasedRewards._sum.releasedAmount ?? 0,
    },
    pendingPayouts,
    disputes,
    recentVolume: recentReferrals.length,
  });
}
