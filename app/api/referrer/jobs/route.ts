import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildJobWhere, parseJobFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error } = await requireRole("REFERRER");
  if (error) return error;

  const filters = parseJobFilters(new URL(request.url).searchParams);
  const jobs = await prisma.job.findMany({
    where: buildJobWhere(filters),
    include: {
      employer: true,
      skills: { include: { skill: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
