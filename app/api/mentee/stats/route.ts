import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("MENTEE");
  if (error || !session) return error;

  const profile = await prisma.menteeProfile.findUnique({
    where: { userId: session.user.id },
  });

  const [activeMentors, pendingRequests, mentorships] = await Promise.all([
    prisma.mentorship.count({ where: { menteeId: session.user.id, status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { menteeId: session.user.id, status: "PENDING" } }),
    prisma.mentorship.findMany({
      where: { menteeId: session.user.id, status: "ACTIVE" },
      include: { mentor: { include: { profile: true, mentorProfile: true } } },
      take: 3,
    }),
  ]);

  return NextResponse.json({ profile, activeMentors, pendingRequests, mentorships });
}
