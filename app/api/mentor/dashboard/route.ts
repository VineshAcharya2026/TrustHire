import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLifetimeCredits } from "@/lib/credits";
import { getMentorNationBuildingStats } from "@/lib/mentor-scores";

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const mentorUserId = session.user.id;

  const [profile, credits, nationBuilding, activeMentees, pendingRequests, recentMentorships, recentCredits, recentRatings, recentContent] =
    await Promise.all([
      prisma.mentorProfile.findUnique({
        where: { userId: mentorUserId },
        include: {
          skills: { orderBy: { masteryLevel: "desc" }, take: 5 },
          ratingsReceived: true,
          _count: { select: { content: true } },
        },
      }),
      getLifetimeCredits(mentorUserId),
      getMentorNationBuildingStats(mentorUserId),
      prisma.mentorship.count({ where: { mentorId: mentorUserId, status: "ACTIVE" } }),
      prisma.mentorship.count({ where: { mentorId: mentorUserId, status: "PENDING" } }),
      prisma.mentorship.findMany({
        where: { mentorId: mentorUserId },
        include: { mentee: { include: { profile: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.creditLedger.findMany({
        where: { mentor: { userId: mentorUserId } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.mentorshipRating.findMany({
        where: { mentor: { userId: mentorUserId } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { mentorship: { include: { mentee: { include: { profile: true } } } } },
      }),
      prisma.mentorContent.findMany({
        where: { mentor: { userId: mentorUserId } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  const avgRating =
    profile && profile.ratingsReceived.length > 0
      ? profile.ratingsReceived.reduce((s, r) => s + r.rating, 0) / profile.ratingsReceived.length
      : null;

  return NextResponse.json({
    profile: profile
      ? {
          skillsCount: profile.skills.length,
          topSkills: profile.skills,
          isEliteFounder100: profile.isEliteFounder100,
          thoughtLeadershipScore: profile.thoughtLeadershipScore,
          contentCount: profile._count.content,
        }
      : null,
    credits,
    ratings: {
      average: avgRating ? Math.round(avgRating * 10) / 10 : null,
      count: profile?.ratingsReceived.length ?? 0,
    },
    nationBuilding,
    activeMentees,
    pendingRequests,
    recentMentorships,
    recentCredits,
    recentRatings,
    recentContent,
  });
}
