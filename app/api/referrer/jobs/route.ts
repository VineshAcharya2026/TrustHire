import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireRole("REFERRER");
  if (error) return error;

  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    include: { employer: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
