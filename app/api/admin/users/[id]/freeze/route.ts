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

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { status: "FROZEN" },
  });

  await logAudit({
    userId: session.user.id,
    action: "USER_FROZEN",
    entity: "User",
    entityId: params.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json(user);
}
