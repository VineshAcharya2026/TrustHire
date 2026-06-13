import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("EMPLOYER");
  if (error || !session) return error;

  const employer = await prisma.employer.findUnique({
    where: { userId: session.user.id },
  });
  if (!employer) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  const referral = await prisma.referral.findFirst({
    where: { id: params.id, job: { employerId: employer.id } },
    include: {
      job: true,
      referrer: { include: { profile: true } },
      reward: { include: { payouts: true } },
      milestones: true,
    },
  });

  if (!referral) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(referral);
}
