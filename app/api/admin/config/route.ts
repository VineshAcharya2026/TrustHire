import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllConfig } from "@/lib/config";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";

const schema = z.record(z.string());

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  return NextResponse.json(await getAllConfig());
}

export async function PATCH(request: Request) {
  const { error, session } = await requireRole("ADMIN");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid config" }, { status: 400 });
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    await prisma.platformConfig.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  await logAudit({
    userId: session.user.id,
    action: "CONFIG_UPDATED",
    entity: "PlatformConfig",
    ipAddress: getClientIp(request),
    metadata: parsed.data,
  });

  return NextResponse.json(await getAllConfig());
}
