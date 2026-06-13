import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateReferralStatusSchema } from "@/lib/validators/referral";
import { logAudit } from "@/lib/audit";
import { getClientIp, formatCurrency } from "@/lib/utils";
import { triggerRewardLock } from "@/lib/reward-engine";
import { sendStatusUpdate, sendRewardLocked } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { notifyReferrerHired } from "@/lib/whatsapp";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = updateReferralStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const existing = await prisma.referral.findFirst({
    where: { id: params.id, job: { employerId: employer.id } },
    include: { job: true, referrer: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const referral = await prisma.referral.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  await logAudit({
    userId: session.user.id,
    action: "REFERRAL_STATUS_UPDATED",
    entity: "Referral",
    entityId: params.id,
    referralId: params.id,
    ipAddress: getClientIp(request),
    metadata: { status: parsed.data.status, note: parsed.data.note },
  });

  await sendStatusUpdate(
    existing.candidateEmail,
    existing.referrer.email,
    parsed.data.status,
    existing.job.title
  );

  if (parsed.data.status === "HIRED") {
    const reward = await triggerRewardLock(params.id, session.user.id, getClientIp(request));
    await sendRewardLocked(existing.referrer.email, existing.job.rewardAmount, existing.job.title);
    await createNotification(
      existing.referrerId,
      `Candidate hired! ${formatCurrency(existing.job.rewardAmount)} reward locked for ${existing.job.title}`,
      "REWARD"
    );
    if (existing.referrer.phone) {
      await notifyReferrerHired(
        existing.referrer.phone,
        existing.candidateName,
        existing.job.rewardAmount
      );
    }
    return NextResponse.json({ referral, reward });
  }

  return NextResponse.json(referral);
}
