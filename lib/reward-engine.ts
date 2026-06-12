import { prisma } from "@/lib/prisma";
import { getMilestoneConfig } from "@/lib/config";
import { logAudit } from "@/lib/audit";
import { RewardStatus } from "@prisma/client";

export async function triggerRewardLock(referralId: string, adminOrUserId?: string, ip?: string) {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    include: { job: true, reward: true },
  });
  if (!referral || referral.reward) return referral?.reward;

  const milestones = await getMilestoneConfig();

  const reward = await prisma.$transaction(async (tx) => {
    const created = await tx.reward.create({
      data: {
        referralId,
        totalAmount: referral.job.rewardAmount,
        status: RewardStatus.LOCKED,
      },
    });

    for (const m of milestones) {
      await tx.retentionMilestone.create({
        data: {
          referralId,
          dayMark: m.dayMark,
          percentage: m.percentage,
        },
      });
    }

    return created;
  });

  await logAudit({
    userId: adminOrUserId,
    action: "REWARD_LOCKED",
    entity: "Reward",
    entityId: reward.id,
    referralId,
    ipAddress: ip,
    metadata: { totalAmount: reward.totalAmount },
  });

  return reward;
}

export async function confirmMilestone(milestoneId: string, employerUserId: string, ip?: string) {
  const milestone = await prisma.retentionMilestone.findUnique({
    where: { id: milestoneId },
    include: { referral: { include: { reward: true, job: true } } },
  });
  if (!milestone || milestone.confirmed) return null;

  const updated = await prisma.retentionMilestone.update({
    where: { id: milestoneId },
    data: { confirmed: true, confirmedAt: new Date() },
  });

  const amount = (milestone.referral.reward!.totalAmount * milestone.percentage) / 100;

  await prisma.payout.create({
    data: {
      rewardId: milestone.referral.reward!.id,
      amount,
      status: "PENDING",
      note: `Day ${milestone.dayMark} retention milestone`,
    },
  });

  await logAudit({
    userId: employerUserId,
    action: "MILESTONE_CONFIRMED",
    entity: "RetentionMilestone",
    entityId: milestoneId,
    referralId: milestone.referralId,
    ipAddress: ip,
    metadata: { dayMark: milestone.dayMark, amount },
  });

  return updated;
}

export async function triggerMilestonePayout(
  payoutId: string,
  adminId: string,
  ip?: string
) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      reward: {
        include: {
          referral: { include: { milestones: true } },
        },
      },
    },
  });
  if (!payout || payout.status !== "PENDING") return null;

  const reward = payout.reward;
  const newReleased = reward.releasedAmount + payout.amount;
  const allMilestones = reward.referral.milestones;
  const allConfirmed = allMilestones.every((m) => m.confirmed);
  const allPaid = await prisma.payout.count({
    where: { rewardId: reward.id, status: "APPROVED" },
  });

  const updatedPayout = await prisma.$transaction(async (tx) => {
    const approved = await tx.payout.update({
      where: { id: payoutId },
      data: {
        status: "APPROVED",
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    let newStatus: RewardStatus = RewardStatus.PARTIAL;
    if (allConfirmed && allPaid + 1 >= allMilestones.length) {
      newStatus = RewardStatus.RELEASED;
    }

    await tx.reward.update({
      where: { id: reward.id },
      data: {
        releasedAmount: newReleased,
        status: newStatus,
      },
    });

    return approved;
  });

  await logAudit({
    userId: adminId,
    action: "PAYOUT_APPROVED",
    entity: "Payout",
    entityId: payoutId,
    referralId: reward.referralId,
    ipAddress: ip,
    metadata: { amount: payout.amount },
  });

  return updatedPayout;
}

export async function flagRewardDispute(
  rewardId: string,
  reason: string,
  adminId: string,
  ip?: string
) {
  const reward = await prisma.reward.update({
    where: { id: rewardId },
    data: { status: RewardStatus.DISPUTED },
  });

  await logAudit({
    userId: adminId,
    action: "REWARD_DISPUTED",
    entity: "Reward",
    entityId: rewardId,
    referralId: reward.referralId,
    ipAddress: ip,
    metadata: { reason },
  });

  return reward;
}
