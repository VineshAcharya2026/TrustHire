import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildReferralWhere, parseReferralFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const filters = parseReferralFilters(new URL(request.url).searchParams);
  const referrals = await prisma.referral.findMany({
    where: {
      AND: [{ job: { employerId: employer.id } }, buildReferralWhere(filters)],
    },
    include: {
      job: { include: { skills: { include: { skill: true } } } },
      referrer: { include: { profile: true } },
      reward: { include: { payouts: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(referrals);
}
