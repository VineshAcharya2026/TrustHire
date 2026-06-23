import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  const mentorships = await prisma.mentorship.findMany({
    where: { mentorId: session.user.id },
    include: {
      mentee: { include: { profile: true, menteeProfile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(mentorships);
}
