import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const referrals = await prisma.referral.findMany({
    where: { job: { employerId: employer.id } },
    include: { job: true },
  });

  const jobs = await prisma.job.count({
    where: { employerId: employer.id, isActive: true },
  });

  const total = referrals.length;
  const interviewed = referrals.filter((r) =>
    ["INTERVIEW_SCHEDULED", "INTERVIEW_DONE", "OFFER_MADE", "HIRED"].includes(r.status)
  ).length;
  const hired = referrals.filter((r) => r.status === "HIRED").length;

  const byJob = await prisma.job.findMany({
    where: { employerId: employer.id },
    include: { _count: { select: { referrals: true } } },
  });

  return NextResponse.json({
    activeJobs: jobs,
    totalReferrals: total,
    interviewRate: total ? Math.round((interviewed / total) * 100) : 0,
    hireRate: total ? Math.round((hired / total) * 100) : 0,
    hires: hired,
    referralsByJob: byJob.map((j) => ({ title: j.title, count: j._count.referrals })),
  });
}
