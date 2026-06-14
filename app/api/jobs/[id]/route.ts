import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole(["REFERRER", "MENTOR", "MENTEE"]);
  if (error) return error;

  const job = await prisma.job.findFirst({
    where: { id: params.id, isActive: true },
    include: {
      employer: true,
      skills: { include: { skill: true } },
      _count: { select: { referrals: true } },
    },
  });

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}
