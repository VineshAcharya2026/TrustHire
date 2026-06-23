import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const action = searchParams.get("action");
  const entity = searchParams.get("entity");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 50;

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(action ? { action } : {}),
      ...(entity ? { entity } : {}),
    },
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(logs);
}
