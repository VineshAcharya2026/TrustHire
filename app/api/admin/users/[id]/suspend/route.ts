import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";

const schema = z.object({ reason: z.string().min(1) });

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Reason required" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { status: "SUSPENDED" },
  });

  await logAudit({
    userId: session.user.id,
    action: "USER_SUSPENDED",
    entity: "User",
    entityId: params.id,
    ipAddress: getClientIp(request),
    metadata: { reason: parsed.data.reason },
  });

  return NextResponse.json(user);
}
