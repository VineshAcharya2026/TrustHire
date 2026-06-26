import type { CreditType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { recalculateThoughtLeadershipScore } from "@/lib/mentor-scores";

export const CREDIT_AMOUNTS = {
  MENTORSHIP_COMPLETED: 10,
  RATING_5_STAR: 5,
  RATING_4_STAR: 3,
  NATION_BUILDING_OUTCOME: 20,
  FREE_MENTORSHIP: 15,
  CONTENT_PUBLISHED: 2,
} as const;

type Tx = Prisma.TransactionClient;

async function getMentorProfileId(mentorUserId: string, tx: Tx = prisma) {
  const profile = await tx.mentorProfile.findUnique({
    where: { userId: mentorUserId },
    select: { id: true },
  });
  if (!profile) throw new Error("Mentor profile not found");
  return profile.id;
}

export async function awardCredits(
  mentorUserId: string,
  amount: number,
  type: CreditType,
  reason: string,
  mentorshipId?: string,
  tx: Tx = prisma
) {
  const mentorId = await getMentorProfileId(mentorUserId, tx);

  await tx.creditLedger.create({
    data: { mentorId, amount, type, reason, mentorshipId },
  });

  await tx.mentorProfile.update({
    where: { id: mentorId },
    data: { creditsBalance: { increment: amount } },
  });
}

export async function awardCreditsAndRecalculate(
  mentorUserId: string,
  amount: number,
  type: CreditType,
  reason: string,
  mentorshipId?: string
) {
  await prisma.$transaction(async (tx) => {
    await awardCredits(mentorUserId, amount, type, reason, mentorshipId, tx);
  });
  await recalculateThoughtLeadershipScore(mentorUserId);
}

export async function getLifetimeCredits(mentorUserId: string) {
  const profile = await prisma.mentorProfile.findUnique({
    where: { userId: mentorUserId },
    select: { id: true, creditsBalance: true },
  });
  if (!profile) return { balance: 0, lifetime: 0 };

  const agg = await prisma.creditLedger.aggregate({
    where: { mentorId: profile.id, amount: { gt: 0 } },
    _sum: { amount: true },
  });

  return {
    balance: profile.creditsBalance,
    lifetime: agg._sum.amount ?? 0,
  };
}

export function ratingCreditAmount(rating: number) {
  if (rating === 5) return CREDIT_AMOUNTS.RATING_5_STAR;
  if (rating === 4) return CREDIT_AMOUNTS.RATING_4_STAR;
  return 0;
}
