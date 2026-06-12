import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const rewards = await prisma.reward.findMany({
    where: { referral: { referrerId: session.user.id } },
    include: {
      referral: { include: { job: true } },
      payouts: { orderBy: { approvedAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rewards);
}
