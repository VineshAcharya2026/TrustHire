import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { reward: true, job: true },
  });

  const rewards = await prisma.reward.findMany({
    where: { referral: { referrerId: session.user.id } },
  });

  const active = referrals.filter((r) => !["HIRED", "REJECTED"].includes(r.status)).length;
  const rejected = referrals.filter((r) => r.status === "REJECTED").length;
  const hired = referrals.filter((r) => r.status === "HIRED").length;

  const locked = rewards
    .filter((r) => r.status === "LOCKED" || r.status === "PARTIAL")
    .reduce((s, r) => s + (r.totalAmount - r.releasedAmount), 0);
  const released = rewards.reduce((s, r) => s + r.releasedAmount, 0);

  return NextResponse.json({
    totalReferrals: referrals.length,
    active,
    rejected,
    hires: hired,
    lockedRewards: locked,
    releasedRewards: released,
    totalEarned: rewards.reduce((s, r) => s + r.totalAmount, 0),
  });
}
