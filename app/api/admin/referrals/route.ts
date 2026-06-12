import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const referrals = await prisma.referral.findMany({
    include: {
      job: { include: { employer: true } },
      referrer: { include: { profile: true } },
      reward: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(referrals);
}
