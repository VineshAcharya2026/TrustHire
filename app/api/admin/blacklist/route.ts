import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["EMAIL", "PHONE", "DOMAIN"]),
  value: z.string().min(1),
  reason: z.string().optional(),
});

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const items = await prisma.blacklist.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.blacklist.create({
    data: {
      type: parsed.data.type,
      value: parsed.data.value.toLowerCase().trim(),
      reason: parsed.data.reason,
      addedBy: session.user.id,
    },
  });

  await logAudit({
    userId: session.user.id,
    action: "BLACKLIST_ADDED",
    entity: "Blacklist",
    entityId: item.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json(item, { status: 201 });
}
