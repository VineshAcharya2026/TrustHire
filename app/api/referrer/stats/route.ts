import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { job: true },
  });

  const active = referrals.filter((r) => !["HIRED", "REJECTED"].includes(r.status)).length;
  const rejected = referrals.filter((r) => r.status === "REJECTED").length;
  const hired = referrals.filter((r) => r.status === "HIRED").length;

  return NextResponse.json({
    totalReferrals: referrals.length,
    active,
    rejected,
    hires: hired,
  });
}
