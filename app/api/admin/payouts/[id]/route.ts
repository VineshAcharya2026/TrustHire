import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const payout = await prisma.payout.findUnique({
    where: { id: params.id },
    include: {
      reward: {
        include: {
          referral: {
            include: {
              referrer: { include: { profile: true } },
              job: { include: { employer: true } },
              milestones: true,
            },
          },
          payouts: { orderBy: { approvedAt: "desc" } },
        },
      },
    },
  });

  if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 });

  return NextResponse.json(payout);
}
