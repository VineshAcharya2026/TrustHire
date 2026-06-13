import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { triggerMilestonePayout } from "@/lib/reward-engine";
import { getClientIp, formatCurrency } from "@/lib/utils";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { notifyReferrerRewardReleased } from "@/lib/whatsapp";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const payout = await triggerMilestonePayout(params.id, session.user.id, getClientIp(request));
  if (!payout) {
    return NextResponse.json({ error: "Payout not found or already processed" }, { status: 404 });
  }

  const full = await prisma.payout.findUnique({
    where: { id: params.id },
    include: { reward: { include: { referral: { include: { referrer: true } } } } },
  });

  if (full?.reward.referral.referrer) {
    await createNotification(
      full.reward.referral.referrer.id,
      `Payout of ${formatCurrency(full.amount)} approved`,
      "PAYOUT"
    );
    if (full.reward.referral.referrer.phone) {
      await notifyReferrerRewardReleased(full.reward.referral.referrer.phone, full.amount);
    }
  }

  return NextResponse.json(payout);
}
