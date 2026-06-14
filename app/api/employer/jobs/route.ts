import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createJobSchema } from "@/lib/validators/job";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";
import { parseSkillInput, syncJobSkills } from "@/lib/skills";
import { buildJobWhere, parseJobFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const filters = parseJobFilters(new URL(request.url).searchParams);
  const jobs = await prisma.job.findMany({
    where: {
      AND: [{ employerId: employer.id }, buildJobWhere({ ...filters, activeOnly: false })],
    },
    include: {
      _count: { select: { referrals: true } },
      skills: { include: { skill: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const job = await prisma.job.create({
    data: {
      employerId: employer.id,
      title: parsed.data.title,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      rewardAmount: parsed.data.rewardAmount,
    },
  });

  const skillNames = [
    ...parseSkillInput(parsed.data.skills),
    ...parseSkillInput(parsed.data.requirements),
  ];
  await syncJobSkills(job.id, skillNames);

  await logAudit({
    userId: session.user.id,
    action: "JOB_CREATED",
    entity: "Job",
    entityId: job.id,
    ipAddress: getClientIp(request),
  });

  return NextResponse.json(job, { status: 201 });
}
