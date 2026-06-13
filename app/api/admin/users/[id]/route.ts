import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      employer: { include: { jobs: { include: { _count: { select: { referrals: true } } } } } },
      referrals: {
        take: 10,
        orderBy: { submittedAt: "desc" },
        include: { job: true, reward: true },
      },
      _count: { select: { referrals: true, auditLogs: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
