import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const referral = await prisma.referral.findFirst({
    where: { id: params.id, referrerId: session.user.id },
    include: {
      job: { include: { employer: true } },
      reward: { include: { payouts: true } },
      milestones: true,
    },
  });

  if (!referral) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(referral);
}
