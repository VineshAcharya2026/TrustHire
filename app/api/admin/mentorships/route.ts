import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const mentorships = await prisma.mentorship.findMany({
    include: {
      mentor: { include: { profile: true, mentorProfile: true } },
      mentee: { include: { profile: true, menteeProfile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(mentorships);
}
