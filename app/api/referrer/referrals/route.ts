import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitReferralSchema } from "@/lib/validators/referral";
import { isBlacklisted } from "@/lib/blacklist";
import { getConfig } from "@/lib/config";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";
import { sendReferralConfirmation } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

import { buildReferralWhere, parseReferralFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const filters = parseReferralFilters(new URL(request.url).searchParams);
  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id, ...buildReferralWhere(filters) },
    include: {
      job: { include: { employer: true, skills: { include: { skill: true } } } },
      reward: { include: { payouts: true } },
      milestones: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(referrals);
}

export async function POST(request: Request) {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const body = await request.json();
  const parsed = submitReferralSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.candidateEmail.toLowerCase();

  const referrer = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!referrer) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (email === referrer.email.toLowerCase() || data.candidatePhone === referrer.phone) {
    return NextResponse.json({ error: "You cannot refer yourself." }, { status: 400 });
  }

  if (await isBlacklisted(email, data.candidatePhone)) {
    return NextResponse.json(
      { error: "Candidate credentials are blacklisted." },
      { status: 403 }
    );
  }

  const duplicate = await prisma.referral.findUnique({
    where: { jobId_candidateEmail: { jobId: data.jobId, candidateEmail: email } },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "A referral for this candidate already exists for this job." },
      { status: 409 }
    );
  }

  const maxPerDay = parseInt(await getConfig("max_referrals_per_day"), 10);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayCount = await prisma.referral.count({
    where: { referrerId: session.user.id, submittedAt: { gte: startOfDay } },
  });
  if (todayCount >= maxPerDay) {
    return NextResponse.json({ error: "Daily referral limit exceeded." }, { status: 429 });
  }

  const job = await prisma.job.findFirst({
    where: { id: data.jobId, isActive: true },
    include: { employer: { include: { user: true } } },
  });
  if (!job) {
    return NextResponse.json({ error: "Job not found or inactive" }, { status: 404 });
  }

  const referral = await prisma.referral.create({
    data: {
      jobId: data.jobId,
      referrerId: session.user.id,
      candidateName: data.candidateName,
      candidateEmail: email,
      candidatePhone: data.candidatePhone,
      resumeUrl: data.resumeUrl || undefined,
    },
    include: { job: true },
  });

  const ip = getClientIp(request);
  await logAudit({
    userId: session.user.id,
    action: "REFERRAL_SUBMITTED",
    entity: "Referral",
    entityId: referral.id,
    referralId: referral.id,
    ipAddress: ip,
  });

  await sendReferralConfirmation(referrer.email, email, job.title);
  await createNotification(
    job.employer.userId,
    `New referral: ${data.candidateName} for ${job.title}`,
    "REFERRAL"
  );

  return NextResponse.json(referral, { status: 201 });
}
