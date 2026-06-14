import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { confirmMilestone } from "@/lib/reward-engine";
import { getClientIp, formatCurrency } from "@/lib/utils";
import { createNotification } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const milestone = await prisma.retentionMilestone.findUnique({
    where: { id: params.id },
    include: {
      referral: {
        include: {
          reward: true,
          referrer: true,
        },
      },
    },
  });

  if (!milestone) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (milestone.confirmed) {
    return NextResponse.json({ error: "Milestone already confirmed" }, { status: 400 });
  }

  const updated = await confirmMilestone(params.id, session.user.id, getClientIp(request));
  if (!updated) {
    return NextResponse.json({ error: "Could not confirm milestone" }, { status: 400 });
  }

  const amount =
    milestone.referral.reward &&
    (milestone.referral.reward.totalAmount * milestone.percentage) / 100;

  if (milestone.referral.referrerId && amount) {
    await createNotification(
      milestone.referral.referrerId,
      `Day ${milestone.dayMark} milestone confirmed — ${formatCurrency(amount)} payout queued`,
      "PAYOUT"
    );
  }

  return NextResponse.json(updated);
}
