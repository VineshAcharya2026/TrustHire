import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const referrals = await prisma.referral.findMany({
    where: {
      job: { employerId: employer.id },
      ...(status ? { status: status as "SUBMITTED" } : {}),
    },
    include: {
      job: true,
      referrer: { include: { profile: true } },
      reward: { include: { payouts: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(referrals);
}
