import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const payouts = await prisma.payout.findMany({
    where: { status: "PENDING" },
    include: {
      reward: {
        include: {
          referral: {
            include: {
              referrer: { include: { profile: true } },
              job: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(payouts);
}
