import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildReferralWhere, parseReferralFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const filters = parseReferralFilters(new URL(request.url).searchParams);
  const referrals = await prisma.referral.findMany({
    where: buildReferralWhere(filters),
    include: {
      job: { include: { employer: true, skills: { include: { skill: true } } } },
      referrer: { include: { profile: true } },
      reward: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(referrals);
}
