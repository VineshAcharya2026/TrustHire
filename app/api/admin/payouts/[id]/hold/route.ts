import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const payout = await prisma.payout.update({
    where: { id: params.id },
    data: { status: "ON_HOLD" },
  });

  await logAudit({
    userId: session.user.id,
    action: "PAYOUT_HELD",
    entity: "Payout",
    entityId: params.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json(payout);
}
