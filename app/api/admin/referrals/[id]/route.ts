import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";
import { ReferralStatus } from "@prisma/client";
import { triggerRewardLock } from "@/lib/reward-engine";

const schema = z.object({
  status: z.nativeEnum(ReferralStatus),
  reason: z.string().min(1),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const referral = await prisma.referral.findUnique({
    where: { id: params.id },
    include: {
      job: { include: { employer: true } },
      referrer: { include: { profile: true } },
      reward: { include: { payouts: true } },
      milestones: true,
    },
  });

  if (!referral) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(referral);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const referral = await prisma.referral.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  if (parsed.data.status === "HIRED") {
    await triggerRewardLock(params.id, session.user.id, getClientIp(request));
  }

  await logAudit({
    userId: session.user.id,
    action: "ADMIN_REFERRAL_OVERRIDE",
    entity: "Referral",
    entityId: params.id,
    referralId: params.id,
    ipAddress: getClientIp(request),
    metadata: { status: parsed.data.status, reason: parsed.data.reason },
  });

  return NextResponse.json(referral);
}
