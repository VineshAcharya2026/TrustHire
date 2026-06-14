import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMentorWhere, parseMentorFilters } from "@/lib/filters";

export async function GET(request: Request) {
  const { error } = await requireRole("MENTEE");
  if (error) return error;

  const filters = parseMentorFilters(new URL(request.url).searchParams);
  const mentors = await prisma.user.findMany({
    where: buildMentorWhere(filters),
    include: {
      profile: true,
      mentorProfile: true,
      mentorSessions: { where: { status: "ACTIVE" }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    mentors.map((m) => ({
      id: m.id,
      email: m.email,
      name: m.profile ? `${m.profile.firstName} ${m.profile.lastName}` : m.email,
      profile: m.mentorProfile,
      activeMentees: m.mentorSessions.length,
    }))
  );
}
