import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const users = await prisma.user.findMany({
    where: { status: "PENDING" },
    include: { profile: true, employer: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
