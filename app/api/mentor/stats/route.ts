import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const [activeMentees, pendingRequests, mentorships] = await Promise.all([
    prisma.mentorship.count({ where: { mentorId: session.user.id, status: "ACTIVE" } }),
    prisma.mentorship.count({ where: { mentorId: session.user.id, status: "PENDING" } }),
    prisma.mentorship.findMany({
      where: { mentorId: session.user.id, status: { in: ["ACTIVE", "PENDING"] } },
      include: {
        mentee: { include: { profile: true, menteeProfile: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return NextResponse.json({ activeMentees, pendingRequests, mentorships });
}
