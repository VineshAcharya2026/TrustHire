import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { status: "ACTIVE" },
    include: { profile: true, employer: true },
  });

  if (user.employer) {
    await prisma.employer.update({
      where: { id: user.employer.id },
      data: { verified: true },
    });
  }

  await logAudit({
    userId: session.user.id,
    action: "USER_APPROVED",
    entity: "User",
    entityId: params.id,
    ipAddress: getClientIp(request),
  });

  await createNotification(user.id, "Your account has been approved. Welcome to TrustHire!", "ACCOUNT");

  return NextResponse.json(user);
}
