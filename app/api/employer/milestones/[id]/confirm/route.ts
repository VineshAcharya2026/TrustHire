import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { confirmMilestone } from "@/lib/reward-engine";
import { getClientIp } from "@/lib/utils";
import { sendRetentionReminder } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const milestone = await prisma.retentionMilestone.findUnique({
    where: { id: params.id },
    include: {
      referral: {
        include: {
          job: { include: { employer: { include: { user: true } } } },
        },
      },
    },
  });

  if (!milestone || milestone.referral.job.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await confirmMilestone(params.id, session.user.id, getClientIp(request));

  const admins = await prisma.user.findMany({ where: { role: "ADMIN", status: "ACTIVE" } });
  for (const admin of admins) {
    await createNotification(
      admin.id,
      `Milestone Day ${milestone.dayMark} confirmed for ${milestone.referral.candidateName} — payout pending`,
      "PAYOUT"
    );
  }

  return NextResponse.json(updated);
}
