import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireRole("REFERRER");
  if (error || !session) return error;

  const reward = await prisma.reward.findFirst({
    where: {
      id: params.id,
      referral: { referrerId: session.user.id },
    },
    include: {
      referral: {
        include: {
          job: { include: { employer: true } },
          milestones: { orderBy: { dayMark: "asc" } },
        },
      },
      payouts: { orderBy: { approvedAt: "desc" } },
    },
  });

  if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

  return NextResponse.json(reward);
}
